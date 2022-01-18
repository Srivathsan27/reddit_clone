import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import FormInput from "../../components/FormInput";
import Wrapper from "../../components/UI/Wrapper";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return (
    <Wrapper type="small">
      <Formik
        initialValues={{
          password: "",
          "confirm-password": "",
        }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
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
    </Wrapper>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return { token: query.token as string };
};

export default ChangePassword;
