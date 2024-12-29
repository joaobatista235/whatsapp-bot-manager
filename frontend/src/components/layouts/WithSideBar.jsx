import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "../sidebar";

const WithSideBar = ({ children }) => {
  return (
    <Flex>
      <Sidebar />
      <Box ml="60" p="4" w="full" minH={"100vh"} bg={"gray.200"}>
        {children}
      </Box>
    </Flex>
  );
};

export default WithSideBar;
