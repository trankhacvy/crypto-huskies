import { useMemo } from "react";
import { Contract } from "@ethersproject/contracts";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";

import nftAbi from "../contracts/FairyNFT.json";
import marketplaceAbi from "../contracts/Marketplace.json";

export const MARKETPLACE_CONTRACT = process.env.MARKETPLACE_CONTRACT_ADDRESS;
export const NFT_CONTRACT = process.env.NFT_CONTRACT_ADDRESS;

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function getSigner(library, account) {
  return library.getSigner(account).connectUnchecked();
}

export function getProviderOrSigner(library, account) {
  return account ? getSigner(library, account) : library;
}

export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account));
}

export function useContract(address, ABI, withSignerIfPossible = true) {
  const { library, account } = useWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export const useNftContract = () => {
  return useContract(NFT_CONTRACT, nftAbi.abi);
};

export const useMarketplaceContract = () => {
  return useContract(MARKETPLACE_CONTRACT, marketplaceAbi.abi);
};
