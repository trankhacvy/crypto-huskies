import React from "react";
import { Image, Center } from "@chakra-ui/react";
import ArtworkGrid from "../../ArtworkGrid";
import { useWeb3React } from "@web3-react/core";
import { queryMySells } from "../../../lib/apis";
import useQueryArtworks from "../../../hooks/useQueryArtworks";
import { utils } from "ethers";

export default () => {
  const { account } = useWeb3React();
  const queryKey = React.useMemo(
    () => (account ? queryMySells(utils.hexlify(account)) : null),
    [account]
  );
  const { isLoading, data } = useQueryArtworks(queryKey);

  if (isLoading) {
    return (
      <Center w="full" h="calc(100vh - 160px)">
        <Image src="/loading.gif" w="300px" h="300px" />
      </Center>
    );
  }

  return <ArtworkGrid isLoading={isLoading} artworks={data} />;
};
