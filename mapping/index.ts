import { MarketItemEvent } from "../generated/Marketplace/Marketplace";
import { Artwork, User } from "../generated/schema";

export function handleMarketItemEvent(event: MarketItemEvent): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let artwork = Artwork.load(event.params.tokenId.toString());

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (artwork == null) {
    artwork = new Artwork(event.params.tokenId.toString());
  }

  artwork.itemId = event.params.itemId;
  artwork.nftContract = event.params.nftContract;
  artwork.tokenId = event.params.tokenId;
  artwork.tokenURI = event.params.tokenURI;
  artwork.seller = event.params.seller.toHexString();
  artwork.sellerId = event.params.seller.toHexString();
  artwork.owner = event.params.owner.toHexString();
  artwork.ownerId = event.params.owner.toHexString();
  artwork.price = event.params.price;
  artwork.sold = event.params.sold;
  artwork.createdAt = event.block.timestamp;

  // Entities can be written to the store with `.save()`
  artwork.save();

  let seller = User.load(event.params.seller.toHexString());
  if (!seller) {
    seller = new User(event.params.seller.toHexString());
    seller.save();
  }

  let owner = User.load(event.params.owner.toHexString());
  if (!owner) {
    owner = new User(event.params.owner.toHexString());
    owner.save();
  }
}
