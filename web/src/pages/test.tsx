import { Box } from "@chakra-ui/react";
import { FC } from "react";
import Post from "../components/post/postItem";

interface TestProps {}

const Test: FC<TestProps> = ({}) => {
  return (
    <Box minHeight="100%" minWidth="100%">
      <Post title="post title" content="post content"></Post>
    </Box>
  );
};

export default Test;
