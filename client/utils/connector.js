import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { createStandaloneToast } from "@chakra-ui/react";

const toast = createStandaloneToast();

const POLLING_INTERVAL = 12000;

export function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
}

export const injected = new InjectedConnector({
  supportedChainIds: [parseInt(process.env.SUPPORTED_CHAIN_ID, 10)],
});

export const RPC_URLS = {
  [process.env.SUPPORTED_CHAIN_ID]: process.env.RPC_URL,
};

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider) {
    const chainId = parseInt(process.env.SUPPORTED_CHAIN_ID, 10);
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to setup the network in Metamask:", error);
      if (error.code === -32002) {
        toast({
          title:
            "Permissions request already pending please wait. Please check you wallet",
          status: "warning",
        });
      } else if (error.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: process.env.CHAIN_NAME,
                nativeCurrency: {
                  name: "ETH",
                  symbol: "eth",
                  decimals: 18,
                },
                rpcUrls: RPC_URLS,
                blockExplorerUrls: [process.env.BLOCK_EXPLORER_URL],
              },
            ],
          });
          return true;
        } catch (error) {
          toast({
            title: error?.message,
            status: "error",
          });
          return false;
        }
      }
      return false;
    }
  } else {
    console.error(
      "Can't setup the BSC network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};
