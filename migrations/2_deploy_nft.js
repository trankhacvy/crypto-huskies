const HuskyNFT = artifacts.require("./HuskyNFT.sol");
const Marketplace = artifacts.require("./Marketplace.sol");

module.exports = async function(deployer) {
  await deployer.deploy(Marketplace);
  const marketplace = await Marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);
  await deployer.deploy(HuskyNFT, marketplace.address);
  const nft = await HuskyNFT.deployed();
  console.log("HuskyNFT deployed to:", nft.address);
};
