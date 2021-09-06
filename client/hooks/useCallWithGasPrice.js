import { useCallback } from "react";
import get from "lodash.get";

/**
 * Perform a contract call with a gas price returned from useGasPrice
 * @param contract Used to perform the call
 * @param methodName The name of the method called
 * @param methodArgs An array of arguments to pass to the method
 * @param overrides An overrides object to pass to the method. gasPrice passed in here will take priority over the price returned by useGasPrice
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export function useCallWithGasPrice() {
  const callWithGasPrice = useCallback(
    async (contract, methodName, methodArgs = [], overrides) => {
      const contractMethod = get(contract, methodName);
      const hasManualGasPriceOverride = overrides?.gasPrice;
      const tx = await contractMethod(
        ...methodArgs,
        hasManualGasPriceOverride
          ? { ...overrides }
          : { ...overrides, gasLimit: "2100000" }
      );

      return tx;
    },
    []
  );

  return { callWithGasPrice };
}
