import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Icon,
  CloseButton,
} from "@chakra-ui/react";
import { AccountCircle, Clear } from "@mui/icons-material";
import { FC } from "react";
import NextLink from "next/link";

const ProfileMenu: FC = ({}) => {
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
            <MenuItem>Profile</MenuItem>
            <MenuItem>Your Posts</MenuItem>
            <MenuItem>Your Comments</MenuItem>
            <MenuItem>Friends</MenuItem>
            <MenuItem>Your Rooms</MenuItem>
            <MenuItem>
              <NextLink href="/reset-password"> Reset Password</NextLink>
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};

export default ProfileMenu;
