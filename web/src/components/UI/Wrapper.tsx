import { Box } from "@chakra-ui/react";
import { FC } from "react";

interface WrapperProps {
  type?: "small" | "regular";
}

const Wrapper: FC<WrapperProps> = ({ children, type, ..._ }) => {
  return (
    <Box mt={8} mx="auto" width={type === "small" ? "400px" : "800px"}>
      {children}
    </Box>
  );
};

export default Wrapper;
