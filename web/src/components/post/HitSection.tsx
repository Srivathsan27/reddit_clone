import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Box, Text } from "@chakra-ui/react";
import { FC, useState } from "react";
import { useHitPostMutation } from "../../generated/graphql";

interface HitSectionProps {
  postId: number;
  hitStatus: number;
  hits: number;
}

const HitSection: FC<HitSectionProps> = ({ postId: id, hitStatus, hits }) => {
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
          <ArrowDownIcon color={hitStatus === -1 ? "orange.900" : "teal.500"} />
        }
        onClick={dumpHander}
        isLoading={loading === "dump"}
      />
    </Flex>
  );
};

export default HitSection;
