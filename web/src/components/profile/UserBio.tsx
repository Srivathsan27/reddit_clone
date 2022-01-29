import { CheckIcon, EditIcon } from "@chakra-ui/icons";
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
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { GroupAddOutlined } from "@mui/icons-material";
import { FC } from "react";
import {
  useTagUserMutation,
  useUntagUserMutation,
} from "../../generated/graphql";
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
  const [, tagUser] = useTagUserMutation();
  const [, untagUser] = useUntagUserMutation();

  const toast = useToast();

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
            {user.isTagged ? (
              <IconButton
                aria-label="remove-friend"
                icon={<CheckIcon color="green.700" />}
                onClick={async () => {
                  const resp = await untagUser({
                    friendId: user.id,
                  });
                  if (resp.error || resp.data?.untagUser === false) {
                    console.log(resp.error);
                    console.log(resp.data?.untagUser);
                    toast({
                      duration: 4000,
                      description: "Unable to untag the user!",
                      status: "error",
                      title: "Error",
                      isClosable: true,
                      position: "bottom-left",
                      variant: "solid",
                    });
                  } else {
                    toast({
                      duration: 4000,
                      description: "User untagged successfully!",
                      status: "success",
                      title: "User untagged",
                      isClosable: true,
                      position: "bottom-left",
                      variant: "solid",
                    });
                  }
                }}
              />
            ) : (
              <IconButton
                aria-label="add-friend"
                icon={<GroupAddOutlined color="info" />}
                onClick={async () => {
                  const resp = await tagUser({
                    friendId: user.id,
                  });
                  if (resp.error || resp.data?.tagUser === false) {
                    console.log(resp.error);
                    console.log(resp.data?.tagUser);
                    toast({
                      duration: 4000,
                      description: "Unable to tag the user!",
                      status: "error",
                      title: "Error",
                      isClosable: true,
                      position: "bottom-left",
                      variant: "solid",
                    });
                  } else {
                    toast({
                      duration: 4000,
                      description: "User tagged successfully!",
                      status: "success",
                      title: "User tagged",
                      isClosable: true,
                      position: "bottom-left",
                      variant: "solid",
                    });
                  }
                }}
              />
            )}
          </Flex>
        )}
      </Flex>
    </Card>
  );
};

export default UserBio;
