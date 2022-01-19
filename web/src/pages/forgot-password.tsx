import { Button, Text } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { FC } from "react";
import { createURQLClient } from "../cache/client";
import FormInput from "../components/FormInput";
import Wrapper from "../components/UI/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { isValidEmail } from "../utils/isValidEmail";

interface ForgotPasswordProps {}

const ForgotPassword: FC<ForgotPasswordProps> = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();

  let body: JSX.Element = <></>;
  return (
    <Wrapper type="small">
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          if (!isValidEmail(values.email)) {
            setErrors({
              email: "Invlid Email. Please enter a valid Email!",
            });
          } else {
            const resposnse = await forgotPassword(values);
            if (resposnse.data?.forgotPassword === false) {
              setErrors({
                email: "Invlid Email. Please enter a valid Email!",
              });
            } else {
              body = (
                <Text>
                  An Email has been sent to {values.email}. Please verify to
                  further continue.
                </Text>
              );
            }
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <FormInput name="email" label="Email" />

              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variant="solid"
                colorScheme="green"
              >
                Next
              </Button>
            </Form>
          );
        }}
      </Formik>
      {body}
    </Wrapper>
  );
};

export default withUrqlClient(createURQLClient)(ForgotPassword);
