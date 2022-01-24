import { Box } from "@chakra-ui/react";
import { FC } from "react";

interface WrapperProps {
  type?: "small" | "regular" | "medium";
}

const Wrapper: FC<WrapperProps> = ({ children, type, ..._ }) => {
  let width: string;
  switch (type) {
    case "medium":
      {
        width = "600px";
      }
      break;
    case "small":
      {
        width = "400px";
      }
      break;
    case "regular":
      {
        width = "800px";
      }
      break;
    default: {
      width = "800px";
    }
  }

  return (
    <Box mt={8} mx="auto" width={width}>
      {children}
    </Box>
  );
};

export default Wrapper;
