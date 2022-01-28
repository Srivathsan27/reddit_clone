import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  CloseButton,
  Link,
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
              <Icon as={AccountCircle} color="white" fontSize="xx-large" />
            ) : (
              //   <Icon as={Clear} color="white" fontSize="xx-large" />
              <CloseButton />
            )}
          </MenuButton>
          <MenuList>
            {username === null ? null : (
              <MenuItem textAlign="right">Hello {username}</MenuItem>
            )}
            <MenuItem>Profile</MenuItem>
            <MenuItem>
              <NextLink href="/my-posts">
                <Link>My Posts</Link>
              </NextLink>
            </MenuItem>
            <MenuItem onClick={() => Router.push("/my-comments")}>
              Your Comments
            </MenuItem>
            <MenuItem>Friends</MenuItem>
            <MenuItem>Your Rooms</MenuItem>
            <MenuItem>
              <NextLink href="/reset-password">
                <Link>Reset Password</Link>
              </NextLink>
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default ProfileMenu;
