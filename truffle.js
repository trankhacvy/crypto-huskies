const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");

require("dotenv").config();

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/contracts"),
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*", // Match any network id
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: process.env.MNENOMIC,
          },
          providerOrUrl:
            "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY,
        }),
      network_id: 3,
      websocket: true,
      timeoutBlocks: 50000,
      networkCheckTimeout: 1000000,
    },
  },
  compilers: {
    solc: { version: "^0.8.3" },
  },
  solc: {
    // Turns on the Solidity optimizer. For development the optimizer's
    // quite helpful, just remember to be careful, and potentially turn it
    // off, for live deployment and/or audit time. For more information,
    // see the Truffle 4.0.0 release notes.
    //
    // https://github.com/trufflesuite/truffle/releases/tag/v4.0.0
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
