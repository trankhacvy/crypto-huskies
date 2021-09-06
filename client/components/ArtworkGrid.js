import { useMemo } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import Artwork from "./Artwork";

export default function ArtworksGrid({ artworks, isLoading }) {
  const skeletonData = useMemo(
    () => Array.from({ length: 6 }).map((_, index) => ({ id: index })),
    []
  );

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
      {(isLoading ? skeletonData : artworks).map((artwork) => (
        <Artwork key={artwork.id} {...artwork} />
      ))}
    </SimpleGrid>
  );
}
