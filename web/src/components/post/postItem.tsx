import { Box, Heading, Text } from "@chakra-ui/react";
import { FC } from "react";
import Card from "../UI/Card";

interface PostProps {
  title: string;
  content: string;
}

const PostItem: FC<PostProps> = ({ title, content, ...props }) => {
  return (
    <Card>
      <Heading as="h2" size="xl" p={2}>
        {title}
      </Heading>

      <Text mt={5} p={2} fontSize="1.2em">
        {content}
      </Text>
    </Card>
  );
};

export default PostItem;
