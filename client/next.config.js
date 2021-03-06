require("dotenv").config();

module.exports = {
  env: {
    CHAIN_NAME: process.env.CHAIN_NAME,
    SUPPORTED_CHAIN_ID: process.env.SUPPORTED_CHAIN_ID,
    RPC_URL: process.env.RPC_URL,
    BLOCK_EXPLORER_URL: process.env.BLOCK_EXPLORER_URL,
    REACT_APP_PINATA_API_KEY: process.env.REACT_APP_PINATA_API_KEY,
    REACT_APP_PINATA_API_SECRET: process.env.REACT_APP_PINATA_API_SECRET,
    GRAPHQL_URL: process.env.GRAPHQL_URL,
    NFT_CONTRACT_ADDRESS: process.env.NFT_CONTRACT_ADDRESS,
    MARKETPLACE_CONTRACT_ADDRESS: process.env.MARKETPLACE_CONTRACT_ADDRESS
  },
};
