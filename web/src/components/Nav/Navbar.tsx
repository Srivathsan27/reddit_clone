import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Component, FC, useState } from "react";
import { useLogoutMutation } from "../../generated/graphql";

interface NavbarProps {
  isLoggedIn?: boolean;
  username?: string;
}

const Navbar: FC<NavbarProps> = ({ isLoggedIn, username }) => {
  let bodyRight: any = null;
  let bodyLeft: any = null;
  const router = useRouter();
  const [{ fetching }, logout] = useLogoutMutation();

  const logoutHandler = async () => {
    const response = await logout();
    if (response.error || !response.data?.logout) {
    } else {
      console.log("success");
    }
  };

  if (isLoggedIn) {
    bodyLeft = (
      <Flex>
        <NextLink href="/create-post">
          <Button variant="outline" colorScheme="black" isLoading={fetching}>
            Post +
          </Button>
        </NextLink>
      </Flex>
    );
    bodyRight = (
      <Flex ml="auto" gap={5} alignItems="center" justifyContent="space-evenly">
        <Text>Hello {username} </Text>
        <NextLink href="/reset-password">
          <Button variant="outline" colorScheme="black" isLoading={fetching}>
            Reset
          </Button>
        </NextLink>
        <Button
          onClick={logoutHandler}
          variant="outline"
          colorScheme="black "
          isLoading={fetching}
        >
          Logout
        </Button>
      </Flex>
    );
  } else {
    bodyRight = (
      <Flex ml="auto" gap={5}>
        <NextLink href="/login">
          <Link>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </Flex>
    );
  }

  return (
    <Flex
      padding={8}
      bgColor="green.300"
      alignItems="center"
      justifyContent="space-between"
      position={"sticky"}
      top={0}
      zIndex={10}
    >
      {bodyLeft}
      {bodyRight}
    </Flex>
  );
};

export default Navbar;
