import { useEffect, useState } from "react";
import fetcher from "../lib/fetcher";

function useIPFS(url) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  const fetchData = async (url) => {
    try {
      setIsLoading(true);
      const response = await fetcher(url);
      setData(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(url);
  }, [url]);

  return { isLoading, data };
}

export default useIPFS;
