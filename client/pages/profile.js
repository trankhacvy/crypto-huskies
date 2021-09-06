import React from "react";
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import SaleArtworks from "../components/pages/profile/SaleArtworks";
import OwnArtworks from "../components/pages/profile/OwnArtworks";
import TabItem from "../components/TabItem";

export default () => {
  return (
    <Box p={4}>
      <Tabs variant="unstyled" colorScheme="purple">
        <TabList>
          <TabItem>Sells</TabItem>
          <TabItem>Own</TabItem>
        </TabList>
        <TabPanels>
          <TabPanel>
            <SaleArtworks />
          </TabPanel>
          <TabPanel>
            <OwnArtworks />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
