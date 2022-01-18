import { Flex, Spinner } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { title } from "process";
import { createURQLClient } from "../cache/client";
import Navbar from "../components/Nav/Navbar";
import { useMeQuery, usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data, fetching }] = useMeQuery();

  const [{ data: postsData, fetching: loadingPosts }] = usePostsQuery();

  let body: JSX.Element = (
    <>
      <div>Hello World</div>
    </>
  );

  let nav: any = null;

  if (loadingPosts) {
    body = (
      <Flex alignSelf="center">
        <Spinner size="xl" />
      </Flex>
    );
  } else if (postsData?.posts.errors) {
    body = <div>Oops, Something went wrong!</div>;
  } else if (postsData?.posts.posts === []) {
    body = <div>No Posts Found</div>;
  } else {
    const posts = postsData?.posts?.posts?.map((post) => {
      return { title: post.title, content: post.content, id: post.id };
    });
    body = (
      <ul>
        {posts?.map((post) => {
          return (
            <li key={post.id}>
              Title: {post.title} Content: {post.content}
            </li>
          );
        })}
      </ul>
    );
  }
  if (fetching || !data?.me) {
    nav = <Navbar />;
  } else {
    nav = <Navbar isLoggedIn={true} username={data.me.username} />;
  }

  return (
    <>
      {nav}
      {body}
    </>
  );
};

export default withUrqlClient(createURQLClient)(Index);
