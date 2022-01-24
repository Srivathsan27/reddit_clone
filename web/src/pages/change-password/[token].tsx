import { Button, Text } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import FormInput from "../../components/FormInput";
import Wrapper from "../../components/UI/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createURQLClient } from "../../cache/client";
import { useState } from "react";

const ChangePassword: React.FC = () => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();

  const [body, setBody] = useState(<></>);
  return (
    <Wrapper type="small">
      <Formik
        initialValues={{
          password: "",
          "confirm-password": "",
        }}
        onSubmit={async (
          { password, "confirm-password": conpas },
          { setErrors }
        ) => {
          if (password !== conpas) {
            setErrors({
              password: "The passwords must be the same",
              "confirm-password": "the passwords must be the same",
            });
          } else {
            const response = await changePassword({
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
              password,
            });
            if (!response.data?.changePassword) {
              setBody(<Text>Oops, Something went wrong!</Text>);
            } else if (response.data.changePassword.errors) {
              const errMap = toErrorMap(response.data.changePassword.errors);
              if (!errMap["token"]) setErrors(errMap);
              else {
                setBody(<Text>Token Has Expired!</Text>);
              }
            } else {
              router.replace("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormInput name="password" label="Password" type="password" />

            <FormInput
              name="confirm-password"
              label="Confirm Password"
              boxProps={{
                mt: 4,
              }}
              type="password"
            />
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
      {body}
    </Wrapper>
  );
};

export default withUrqlClient(createURQLClient)(ChangePassword);
