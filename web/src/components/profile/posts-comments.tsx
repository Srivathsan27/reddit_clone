import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { FC } from "react";
import Wrapper from "../UI/Wrapper";
import CommentSection from "./CommentSection";
import PostsSection from "./PostsSection";

interface PostsCommentsProps {
  userId: number;
}

const PostsComments: FC<PostsCommentsProps> = ({ userId }) => {
  return (
    <Wrapper>
      <Tabs colorScheme="blue" color="white" isLazy>
        <TabList>
          <Tab>Posts</Tab>
          <Tab>Comments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PostsSection userId={userId} />
          </TabPanel>

          <TabPanel>{/* <CommentSection /> */}</TabPanel>
        </TabPanels>
      </Tabs>
    </Wrapper>
  );
};

export default PostsComments;
