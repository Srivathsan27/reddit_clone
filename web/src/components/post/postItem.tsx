import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { useHitPostMutation } from "../../generated/graphql";
import Card from "../UI/Card";

interface PostProps {
  id: number;
  title: string;
  content: string;
  creator: string;
  uploadedAt: Date;
  hits: number;
  hitStatus: number;
}

const PostItem: FC<PostProps> = ({
  id,
  hitStatus,
  uploadedAt,
  creator,
  title,
  content,
  hits,
  ..._
}) => {
  const [, hit] = useHitPostMutation();
  const [loading, setLoading] = useState<"hit" | "dump" | "none">("none");

  const hitHander = async () => {
    setLoading("hit");
    await hit({
      post: id,
      value: 1,
    });
    setLoading("none");
  };

  const dumpHander = async () => {
    setLoading("dump");
    await hit({
      post: id,
      value: -1,
    });
    setLoading("none");
  };

  return (
    <Card>
      <Flex gap={3} alignItems="flex-start">
        <Flex mt={2} gap={3} alignItems="center" direction="column" flex={0.12}>
          <IconButton
            colorScheme={hitStatus === 1 ? "green" : "black"}
            aria-label="Call Segun"
            size="md"
            borderRadius="50%"
            icon={
              <ArrowUpIcon color={hitStatus === 1 ? "green.800" : "teal.500"} />
            }
            onClick={hitHander}
            isLoading={loading === "hit"}
          />
          <Box boxSizing="border-box">
            <Text color="blue.500">{hits}</Text>
          </Box>
          <IconButton
            colorScheme={hitStatus === -1 ? "red" : "black"}
            aria-label="Call Segun"
            size="md"
            borderRadius="50%"
            icon={
              <ArrowDownIcon
                color={hitStatus === -1 ? "orange.900" : "teal.500"}
              />
            }
            onClick={dumpHander}
            isLoading={loading === "dump"}
          />
        </Flex>

        <Box flex={0.88} pb={3}>
          <Heading as="h2" size="lg" p={3} pb={1}>
            {title}
          </Heading>
          <Text mt={0.4} p={3} fontSize="sm">
            Post by {creator}. Uploaded at {uploadedAt.toUTCString()}
          </Text>

          <Text mt={5} pb={8} pl={3} fontSize="1.2em" width="94%">
            {content + (content.length === 80 ? "..." : "")}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
};

export default PostItem;
