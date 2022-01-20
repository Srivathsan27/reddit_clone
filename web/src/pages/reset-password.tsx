import { Alert, Button, Flex, Text } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { createURQLClient } from "../cache/client";
import FormInput from "../components/FormInput";
import Wrapper from "../components/UI/Wrapper";
import { useResetPasswordMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface ResetPasswordProps {}

const ResetPassword: FC<ResetPasswordProps> = ({}) => {
  const [, resetPassword] = useResetPasswordMutation();

  const [error, setError] = useState(<></>);
  const [header, setHeader] = useState(<></>);
  const router = useRouter();

  return (
    <>
      <Flex padding={2} justifyContent="center" alignItems="center">
        {header}
      </Flex>
      <Wrapper type="small">
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          onSubmit={async (
            { currentPassword, newPassword, confirmNewPassword },
            { setErrors }
          ) => {
            if (newPassword !== confirmNewPassword) {
              setErrors({
                newPassword: "The passwords do not match!",
                confirmNewPassword: "The passwords do not match",
              });
            } else {
              const response = await resetPassword({
                current: currentPassword,
                new: newPassword,
              });
              console.log(response.data);
              if (response.data?.resetPassword.errors) {
                const errMap = toErrorMap(response.data.resetPassword.errors);
                if (errMap["user"]) {
                  setError(
                    <Text mt={3} textAlign="center">
                      {errMap["user"]}
                    </Text>
                  );
                } else {
                  setErrors(errMap);
                }
              } else {
                setHeader(
                  <Alert status="success">
                    The password has been changed successfully!
                  </Alert>
                );
                setTimeout(() => {
                  router.push("/");
                }, 3000);
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormInput
                name="currentPassword"
                label="Current Password"
                type="password"
              />
              <FormInput
                name="newPassword"
                label="New Password"
                boxProps={{
                  mt: 4,
                }}
                type="password"
              />
              <FormInput
                name="confirmNewPassword"
                label="Confirm New Password"
                boxProps={{
                  mt: 4,
                }}
                type="password"
              />
              {error}
              <Button
                type="submit"
                mt={4}
                colorScheme="green"
                variant="solid"
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createURQLClient)(ResetPassword);
