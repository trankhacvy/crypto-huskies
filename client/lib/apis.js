import fetcher from "./fetcher";

export const queryMarketArtworks = (sold) => `
{
  artworks ( orderBy: createdAt, orderDirection: desc, where : { sold: ${sold} } ) {
      id
      itemId
      tokenId
      tokenURI
      seller {
        id
      }
      owner {
        id
      }
      price
      sold
      createdAt
    }
  }
`;

export const queryMyArtworks = (owner) => `
  {
    artworks(
      orderBy: createdAt
      orderDirection: desc
      where: { owner: "${owner}" }
    ) {
      id
      tokenId
      tokenURI
      nftContract
      seller {
        id
      }
      owner {
        id
      }
      price
      sold
      createdAt
    }
  }
`;

export const queryMySells = (seller) => `
  {
    artworks(
      orderBy: createdAt
      orderDirection: desc
      where: { seller: "${seller}" }
    ) {
      id
      tokenId
      tokenURI
      nftContract
      seller {
        id
      }
      owner {
        id
      }
      price
      sold
      createdAt
    }
  }
`;

export const graphqlFetcher = async (query) => {
  try {
    const response = await fetcher(process.env.GRAPHQL_URL, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      method: "POST",
    });
    return response?.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
