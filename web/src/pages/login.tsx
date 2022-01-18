import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC } from "react";
import FormInput from "../components/FormInput";
import Wrapper from "../components/UI/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface LoginProps {}

const Login: FC<LoginProps> = ({}) => {
  const [mysteryProp, login] = useLoginMutation();
  console.log(mysteryProp);
  const router = useRouter();
  return (
    <Wrapper type="small">
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, { setErrors }) => {
          if (values.username.trim() === "" || values.password.trim() === "") {
            setErrors({
              username:
                values.username.trim() === ""
                  ? "This Field must not be empty!"
                  : undefined,
              password:
                values.password.trim() === ""
                  ? "This Field must not be empty!"
                  : undefined,
            });
          } else {
            const resposnse = await login(values);

            if (resposnse.data?.login.errors) {
              setErrors(toErrorMap(resposnse.data.login.errors));
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <FormInput name="username" label="Username" />
              <FormInput
                name="password"
                label="Password"
                type="password"
                boxProps={{
                  mt: 4,
                }}
              />
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variant="solid"
                colorScheme="green"
              >
                Login
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default Login;
