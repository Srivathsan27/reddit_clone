import { Flex, Skeleton, useToast } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { FC } from "react";
import { createURQLClient } from "../../cache/client";
import UserBio from "../../components/profile/UserBio";
import UserProfile from "../../components/profile/UserProfile";
import Wrapper from "../../components/UI/Wrapper";
import { useGetProfileQuery } from "../../generated/graphql";
import { isServer } from "../../utils/isServer";

interface UserProfilePageProps {}

const UserProfilePage: FC<UserProfilePageProps> = ({}) => {
  const router = useRouter();

  const [{ data, fetching, error }] = useGetProfileQuery({
    variables: {
      id: +(router.query.id as string),
    },
  });

  const toast = useToast();

  if (error || data?.profile.errors) {
    console.log("resp err: ", error);
    console.log("error:", data?.profile.errors);
    toast({
      description: "Could not load user!",
      title: "Error",
      status: "error",
      duration: 3000,
      isClosable: true,
      variant: "solid",
    });
  }

  return (
    <>
      {data?.profile.user && (
        <Wrapper>
          <Flex minH="85vh" align="center" justify="center">
            <Skeleton isLoaded={!fetching} h="100%" w="100%">
              {!fetching && <UserProfile user={data.profile.user} />}
            </Skeleton>
          </Flex>
        </Wrapper>
      )}
    </>
  );
};

export default withUrqlClient(createURQLClient, { ssr: true })(UserProfilePage);
