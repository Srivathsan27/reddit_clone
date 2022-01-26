import { withUrqlClient } from "next-urql";
import { FC } from "react";
import { createURQLClient } from "../cache/client";
import SingleFormPage from "../components/general/SingleFormPage";
import LoginForm from "../components/login/LoginForm";

interface LoginProps {}

const Login: FC<LoginProps> = ({}) => {
  return (
    <SingleFormPage
      form={<LoginForm />}
      title="Login"
      description="Enter your credentials to Login"
    />
  );
};

export default withUrqlClient(createURQLClient)(Login);
