import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { GroupAddOutlined } from "@mui/icons-material";
import { FC } from "react";
import { Gender } from "../../types/gender";
import { ProfileType } from "../../types/profileType";
import { toUpperLowerCase } from "../../utils/toUpperLowerCase";
import Card from "../UI/Card";
import UpdateProfileForm from "./UpdateProfileForm";

interface UserBioProps {
  user: ProfileType;
}

const UserBio: FC<UserBioProps> = ({ user }) => {
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Card>
      <Flex gap="50px" justify="flex-start" p={6}>
        <Flex flex="0.3" justify="center" align="flex-start">
          <Avatar
            size="2xl"
            name={user.username}
            bg="green.300"
            color="blue.700"
          ></Avatar>
        </Flex>
        <Box p={4} flex="0.62">
          <Heading size="lg">{toUpperLowerCase(user.username)}</Heading>
          <Text mt={2} fontSize="md">
            {toUpperLowerCase(user.profile.name)}&emsp;&emsp;
            {toUpperLowerCase(user.profile.sex)}
          </Text>
          <Text fontSize="xl" mt={5}>
            {toUpperLowerCase(user.profile.bio)}
          </Text>
        </Box>
        {user.profile.isOwnProfile ? (
          <Flex flex="0.08">
            <Popover
              isOpen={isOpen}
              onOpen={onOpen}
              onClose={onClose}
              placement="left"
              closeOnBlur={false}
            >
              <PopoverTrigger>
                <IconButton size="lg" aria-label="edit" icon={<EditIcon />} />
              </PopoverTrigger>
              <PopoverContent p={5}>
                <PopoverArrow />
                <PopoverCloseButton />
                <UpdateProfileForm
                  bio={user.profile.bio}
                  name={user.profile.name}
                  sex={user.profile.sex as Gender}
                  userId={user.id}
                />
              </PopoverContent>
            </Popover>
          </Flex>
        ) : (
          <Flex flex="0.08">
            <IconButton
              aria-label="add-friend"
              icon={<GroupAddOutlined color="info" />}
            />
          </Flex>
          //if is friend, have to change the icon to DoneIcon
          // from material ui / CheckIcon from chakra
        )}
      </Flex>
    </Card>
  );
};

export default UserBio;
