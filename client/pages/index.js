import React from "react";
import { Box, Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import TabItem from "../components/TabItem";
import HomeList from "../components/pages/home/HomeList";

export default () => {
  return (
    <Box p={4}>
      <Tabs variant="unstyled" colorScheme="purple">
        <TabList>
          <TabItem>Sells</TabItem>
          <TabItem>Sold</TabItem>
        </TabList>
        <TabPanels>
          <TabPanel>
            <HomeList />
          </TabPanel>
          <TabPanel>
            <HomeList sold />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
