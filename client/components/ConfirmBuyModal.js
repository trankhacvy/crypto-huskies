import { useState } from "react";
import { mutate } from "swr";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useToast,
  Image,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import { utils } from "ethers";
import { useCallWithGasPrice } from "../hooks/useCallWithGasPrice";
import { useMarketplaceContract, NFT_CONTRACT } from "../hooks/useContract";
import useExitPrompt from "../hooks/useExitPrompt";
import { queryMarketArtworks } from "../lib/apis";

function ConfirmBuyModal({ art, isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const marketplaceContract = useMarketplaceContract();
  const { callWithGasPrice } = useCallWithGasPrice();
  const { setShowExitPrompt, showExitPrompt } = useExitPrompt(false);
  const { account } = useWeb3React();

  const handleBuy = async () => {
    try {
      if (!account) {
        toast({
          title: "Error",
          description: "Please connect to your wallet",
          status: "error",
        });
        return;
      }
      setShowExitPrompt(true);
      setIsLoading(true);
      const tx = await callWithGasPrice(
        marketplaceContract,
        "createMarketSale",
        [NFT_CONTRACT, art.tokenId],
        {
          value: art.price,
        }
      );
      const receipt = await tx.wait();
      if (receipt.status) {
        toast({
          title: "Buy successfully",
          status: "success",
          description: "This may take some time to show up",
        });
        mutate(queryMarketArtworks(false));
        onClose();
      } else {
        console.log(receipt);
        toast({
          title: "Error",
          status: "error",
          description: "Oopp, error again :(",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        status: "error",
        description: error?.message ?? "Transaction error",
      });
    } finally {
      setShowExitPrompt(false);
      setIsLoading(false);
    }
  };

  if (!art) return null;

  return (
    <Modal
      closeOnOverlayClick={!showExitPrompt}
      isCentered
      size="xl"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirm</ModalHeader>
        <ModalCloseButton disabled={showExitPrompt} />
        <ModalBody textAlign="center">
          <Text fontSize="xl">{`Want to spend ${utils.formatEther(
            art.price
          )} ETH to buy this art ?`}</Text>
          <Image
            fit="cover"
            width={160}
            height={160}
            src={art.image}
            alt={art.name}
            borderRadius="xl"
            mt="4"
            display="inline-block"
          />
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            mr="4"
            onClick={handleBuy}
            colorScheme="purple"
          >
            Definitely
          </Button>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            mr="4"
            onClick={handleBuy}
            colorScheme="purple"
          >
            Of course
          </Button>
          <Button
            isLoading={isLoading}
            isDisabled={isLoading}
            colorScheme="purple"
            onClick={handleBuy}
          >
            Sure
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ConfirmBuyModal;
