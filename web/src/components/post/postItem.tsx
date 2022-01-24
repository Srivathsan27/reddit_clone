import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { FC } from "react";
import Card from "../UI/Card";

interface PostProps {
  title: string;
  content: string;
  creator: string;
  uploadedAt: Date;
  hits: number;
}

const PostItem: FC<PostProps> = ({
  uploadedAt,
  creator,
  title,
  content,
  hits,
  ...props
}) => {
  return (
    <Card>
      <Heading as="h2" size="xl" p={2}>
        {title}
      </Heading>
      <Text mt={1} p={2} fontSize="sm">
        Post by {creator}. Uploaded at {uploadedAt.toUTCString()}
      </Text>

      <Text mt={5} p={2} fontSize="1.2em">
        {content}
      </Text>

      <Flex mt={4} p={5} alignItems="center" justifyContent="space-between">
        <Flex gap={5}>
          <Button colorScheme="black" variant="outline">
            +
          </Button>
          <Button colorScheme="black" variant="outline">
            -
          </Button>
        </Flex>

        <Box boxSizing="border-box">
          <Text>Hits: {hits}</Text>
        </Box>
      </Flex>
    </Card>
  );
};

export default PostItem;
