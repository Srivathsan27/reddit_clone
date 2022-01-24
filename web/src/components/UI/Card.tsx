import { Box, Flex } from "@chakra-ui/react";
import { FC } from "react";

interface CardProps {}

const Card: FC<CardProps> = ({ children }) => {
  return (
    <Box
      width="100%"
      bgColor="white"
      color="teal"
      padding={2}
      margin={"auto"}
      boxShadow="2px 2px 8px 0px rgba(3,15,2,0.3);"
      borderRadius={5}
    >
      {children}
    </Box>
  );
};

export default Card;
