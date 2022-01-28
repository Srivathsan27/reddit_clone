import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { FC } from "react";
import Wrapper from "../UI/Wrapper";
import CommentSection from "./CommentSection";
import PostsSection from "./PostsSection";

interface PostsCommentsProps {
  userId: number;
  username: string;
}

const PostsComments: FC<PostsCommentsProps> = ({ userId, username }) => {
  return (
    <Wrapper>
      <Tabs colorScheme="blue" color="white" isLazy>
        <TabList>
          <Tab fontSize="lg">Posts</Tab>
          <Tab fontSize="lg">Comments</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <PostsSection userId={userId} />
          </TabPanel>

          <TabPanel>
            <CommentSection username={username} userId={userId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Wrapper>
  );
};

export default PostsComments;
