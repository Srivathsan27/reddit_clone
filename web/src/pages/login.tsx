import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { FC } from "react";
import { createURQLClient } from "../cache/client";
import LoginForm from "../components/login/LoginForm";
import Navbar from "../components/Nav/Navbar";
import Wrapper from "../components/UI/Wrapper";

interface LoginProps {}

const Login: FC<LoginProps> = ({}) => {
  return (
    <>
      <Wrapper type="small">
        <Flex align="center" h="100%" width="100%">
          <Box w="100%">
            <Flex
              mt="25%"
              align="center"
              justify="center"
              direction="column"
              gap={10}
            >
              <Heading size="xl" color="white">
                Bubble.
              </Heading>
              <Box>
                <Heading size="md">Login</Heading>
                <Text color="white">Enter your credentials to login.</Text>
              </Box>
            </Flex>
            <LoginForm />
          </Box>
        </Flex>
      </Wrapper>
    </>
  );
};

export default withUrqlClient(createURQLClient)(Login);
