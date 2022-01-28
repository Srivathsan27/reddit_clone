import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  CloseButton,
  Link,
  Flex,
  Avatar,
} from "@chakra-ui/react";
import { AccountCircle } from "@mui/icons-material";
import { FC } from "react";
import NextLink from "next/link";
import Router from "next/router";

interface ProfileProps {
  username: string | null;
}

const ProfileMenu: FC<ProfileProps> = ({ username }) => {
  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton isActive={isOpen} as={Button} mr={3} bg="transparent">
            {!isOpen ? (
              <Avatar
                name={username as string}
                size="sm"
                bg="green.300"
                color="blue.700"
              />
            ) : (
              //   <Icon as={Clear} color="white" fontSize="xx-large" />
              <CloseButton />
            )}
          </MenuButton>
          <MenuList>
            {username === null ? null : (
              <MenuItem textAlign="right" isDisabled>
                Hello {username}
              </MenuItem>
            )}
            <MenuItem>Profile</MenuItem>
            <MenuItem onClick={() => Router.push("/my-posts")}>
              My Posts
            </MenuItem>
            <MenuItem onClick={() => Router.push("/my-comments")}>
              My Comments
            </MenuItem>
            <MenuItem>Friends</MenuItem>
            <MenuItem>Your Rooms</MenuItem>
            <MenuItem onClick={() => Router.push("/reset-password")}>
              Reset Password
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default ProfileMenu;
