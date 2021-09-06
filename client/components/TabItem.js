import React from "react";
import { Tab } from "@chakra-ui/react";

const TabItem = ({ children }) => (
  <Tab
    _selected={{
      backgroundColor: "purple.500",
      color: "white",
      fontWeight: "semibold",
    }}
    px={8}
    sx={{
      ":first-child": {
        borderLeftRadius: "4px",
      },
      ":last-child": {
        borderRightRadius: "4px",
      },
    }}
    border="1px"
    borderColor="purple.500"
  >
    {children}
  </Tab>
);

export default TabItem;
