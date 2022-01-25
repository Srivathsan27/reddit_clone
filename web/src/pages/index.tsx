import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useEffect, useState } from "react";
import { createURQLClient } from "../cache/client";
import Navbar from "../components/Nav/Navbar";
import PostList from "../components/post/postList";
import { Post, useMeQuery, usePostsQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

const Index = () => {
  const [variables, setvariables] = useState({
    limit: 10,
    cursor: undefined as undefined | string,
  });
  const [{ data: postsData, fetching: loadingPosts }] = usePostsQuery({
    variables: variables,
  });

  let body: JSX.Element = <div>Hello World</div>;

  let nav: any = null;

  if (loadingPosts) {
    body = (
      <Flex alignSelf="center">
        <Spinner size="xl" />
      </Flex>
    );
  } else if (!loadingPosts && !postsData?.posts.posts) {
    body = <Text>Oops, Something went Wrong!</Text>;
  } else {
    const posts = postsData?.posts.posts as Post[];

    body = (
      <Flex
        bg="linear-gradient(to right bottom, #1A2746, #171F3B, #171D3A, #171A36, #131330)"
        pt="5%"
      >
        <PostList
          posts={posts}
          onClick={() => {
            setvariables({
              ...variables,
              cursor: posts[posts.length - 1].createdAt,
            });
          }}
          loadMore={postsData?.posts.hasMorePosts as boolean}
        />
      </Flex>
    );
  }

  return (
    <>
      {nav}
      {body}
    </>
  );
};

export default withUrqlClient(createURQLClient, { ssr: true })(Index);
