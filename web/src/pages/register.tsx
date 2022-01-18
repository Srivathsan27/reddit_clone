import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { FC } from "react";
import { useMutation } from "urql";
import { createURQLClient } from "../cache/client";
import FormInput from "../components/FormInput";
import Wrapper from "../components/UI/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface RegisterProps {}

const Register: FC<RegisterProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Wrapper type="small">
      <Formik
        initialValues={{
          username: "",
          password: "",
          "confirm-password": "",
          email: "",
        }}
        onSubmit={async (
          { username, password, "confirm-password": conpas, email },
          { setErrors }
        ) => {
          if (conpas !== password) {
            setErrors({
              "confirm-password": "Passwords do not match",
              password: "Passwords do not match",
            });
          } else {
            const response = await register({ username, password, email });
            if (response.data?.register.errors) {
              setErrors(toErrorMap(response.data.register.errors));
            } else {
              if (response.data?.register.user) {
                router.push("/");
              }
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <FormInput name="username" label="Username" />
            <FormInput
              name="email"
              label="Email"
              boxProps={{
                mt: 4,
              }}
              type="email"
            />
            <FormInput
              boxProps={{
                mt: 4,
              }}
              name="password"
              label="Password"
              type="password"
            />

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

export default withUrqlClient(createURQLClient)(Register);
