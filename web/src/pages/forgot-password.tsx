import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { FC, useState } from "react";
import { createURQLClient } from "../cache/client";
import FormInput from "../components/FormInput";
import Wrapper from "../components/UI/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { isValidEmail } from "../utils/isValidEmail";

interface ForgotPasswordProps {}

const ForgotPasswordForm = ({}) => {
  const [, forgotPassword] = useForgotPasswordMutation();

  const [body, setBody] = useState<JSX.Element | null>(null);

  return (
    <Flex direction="column" gap={4} mt={6}>
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
              setBody(
                <Text color="white" textAlign="center">
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

              {!body && (
                <Flex w="100%" justify="flex-end">
                  <Button
                    mt={7}
                    type="submit"
                    isLoading={isSubmitting}
                    variant="solid"
                    colorScheme="blue"
                  >
                    Next
                  </Button>
                </Flex>
              )}
            </Form>
          );
        }}
      </Formik>
      <Box mt={7}>{body}</Box>
    </Flex>
  );
};

const ForgotPassword: FC<ForgotPasswordProps> = () => {
  return (
    <Wrapper type="small">
      <Flex align="center" h="100%" width="100%">
        <Box w="100%">
          <Flex
            pt="25%"
            align="center"
            justify="center"
            direction="column"
            gap={8}
          >
            <Heading size="xl" color="white">
              Bubble.
            </Heading>
            <Box>
              <Heading textAlign="center" color="white" size="md">
                Forgot Password
              </Heading>
              <Text mt={3} color="white" textAlign="center">
                Enter your registered Email to continue. <br />
                An email will be sent, and the password can be changed using the
                link provided
              </Text>
            </Box>
          </Flex>
          <ForgotPasswordForm />
        </Box>
      </Flex>
    </Wrapper>
  );
};

export default withUrqlClient(createURQLClient)(ForgotPassword);
