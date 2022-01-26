import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { useHitPostMutation } from "../../generated/graphql";
import Card from "../UI/Card";
import NextLink from "next/link";
import HitSection from "./HitSection";

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
  return (
    <Card>
      <Flex gap={3} alignItems="flex-start">
        <HitSection postId={id} hitStatus={hitStatus} hits={hits} />
        <Box flex={0.88} pb={3}>
          <NextLink href={`/post/${id}`}>
            <Link>
              <Heading as="h2" size="lg" p={3} pb={1}>
                {title}
              </Heading>
            </Link>
          </NextLink>
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
