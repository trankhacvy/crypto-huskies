<img src="img/husky.jpeg" width="30%" alt="Smile">


## [**CryptoHuskies**](https://crypto-huskies.vercel.app)
## Full stack NFT marketplace built with Solidity, Pinata, Thegraph & Next.js. Run on Ropsten

## Install & Start
1. Clone the project locally, change into the directory, and install the dependencies:

    ```sh
    yarn install
    ```
2. Create your own .env
3. Build and deploy smart contracts
    ```sh
    truffle compile
    ```
    ```sh
    truffle migrate --network ropsten
    ```
4. After smart contract deployment, copy the NFTHusky contract address and Marketplacce contract address on the console to update the NFT_CONTRACT_ADDRESS and MARKETPLACE_CONTRACT_ADDRESS value in .env. Use the Marketplacce contract address to update the address value in subgraph.yaml as well. 
5. Build and deploy your subgraph then update the GRAPHQL_URL value in .env
6. Run client
    ```
    cd client
    yarn dev
    ```
7. Pray it works 🙏🙏🙏🙏🙏🙏