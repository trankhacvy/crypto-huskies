import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import fetcher from "../lib/fetcher";
import { graphqlFetcher } from "../lib/apis";

function useQueryArtworks(query) {
  const { data: queryData, error } = useSWR(query, graphqlFetcher);
  const [data, setData] = useState([]);
  const [isFetchingMeta, setFetchingMeta] = useState(false);
  const isLoading = useMemo(() => isFetchingMeta || (!queryData && !error), [
    isFetchingMeta,
    queryData,
    error,
  ]);

  const fetchData = async (artworks) => {
    try {
      const promises = artworks.map((artwork) => fetchMetadata(artwork));
      const result = (await Promise.all(promises)).filter(Boolean);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingMeta(false);
    }
  };

  const fetchMetadata = async (artwork) => {
    try {
      const meta = await fetcher(artwork.tokenURI);
      return {
        ...meta,
        ...artwork,
      };
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    if (queryData && queryData.artworks) {
      fetchData(queryData.artworks);
    }
  }, [queryData]);

  return { isLoading, data };
}

export default useQueryArtworks;
