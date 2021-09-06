import React from "react";
import { Image, Center } from "@chakra-ui/react";
import ArtworkGrid from "../../ArtworkGrid";
import { queryMarketArtworks } from "../../../lib/apis";
import useQueryArtworks from "../../../hooks/useQueryArtworks";

export default ({ sold = false }) => {
  const queryKey = React.useMemo(() => queryMarketArtworks(sold), [sold]);
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
