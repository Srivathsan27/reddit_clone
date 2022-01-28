import { VStack, StackDivider } from "@chakra-ui/react";
import { FC } from "react";
import { MeQuery } from "../../generated/graphql";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: any[];
  user?: MeQuery;
}

const CommentList: FC<CommentListProps> = ({ comments, user }) => {
  return (
    <VStack
      mt={7}
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      {comments.map((comment) => (
        <CommentItem
          key={String(Math.random())}
          comment={comment}
          user={user}
        ></CommentItem>
      ))}
    </VStack>
  );
};

export default CommentList;
