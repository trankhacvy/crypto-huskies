import { useRef, useState, useReducer } from "react";
import { useForm } from "react-hook-form";
import { utils } from "ethers";
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
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  Textarea,
  Flex,
  Image,
  Icon,
  useToast,
  Spinner,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { BiCloudUpload } from "react-icons/bi";
import { FaEthereum } from "react-icons/fa";
import Pinata from "../lib/upload";
import { useWeb3React } from "@web3-react/core";
import {
  useNftContract,
  useMarketplaceContract,
  NFT_CONTRACT,
} from "../hooks/useContract";
import { useCallWithGasPrice } from "../hooks/useCallWithGasPrice";
import useExitPrompt from "../hooks/useExitPrompt";
import { queryMarketArtworks } from "../lib/apis";

const initialState = {
  uploadState: "idle",
  mintState: "idle", // "idle" | "loading" | "success" | "fail";
  listingState: "idle",
};

const reducer = (state, actions) => {
  switch (actions.type) {
    case "upload_sending":
      return {
        ...state,
        uploadState: "loading",
      };
    case "upload_receipt":
      return {
        ...state,
        uploadState: "success",
      };
    case "upload_error":
      return {
        ...state,
        uploadState: "fail",
      };
    case "mint_sending":
      return {
        ...state,
        mintState: "loading",
      };
    case "mint_receipt":
      return {
        ...state,
        mintState: "success",
      };
    case "mint_error":
      return {
        ...state,
        mintState: "fail",
      };
    case "listing_sending":
      return {
        ...state,
        listingState: "loading",
      };
    case "listing_receipt":
      return {
        ...state,
        listingState: "success",
      };
    case "listing_error":
      return {
        ...state,
        listingState: "fail",
      };
    default:
      return state;
  }
};

function MintModal({ isOpen, onClose }) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      price: 0.001,
    },
  });
  const [state, dispatch] = useReducer(reducer, initialState);
  const toast = useToast();
  const [file, setFile] = useState(null);
  const fileRef = useRef();
  const nftContract = useNftContract();
  const marketplaceContract = useMarketplaceContract();
  const { callWithGasPrice } = useCallWithGasPrice();
  const { setShowExitPrompt } = useExitPrompt(false);
  const { account } = useWeb3React();

  const handleBrowserFile = () => {
    if (fileRef && fileRef.current) {
      fileRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      dispatch({ type: "upload_sending" });
      const result = await Pinata.pinFileToIPFS(file);
      if (result) {
        const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
        setFile(url);
        setValue("image", url);
        dispatch({ type: "upload_receipt" });
      } else {
        dispatch({ type: "upload_error" });
      }
    }
  };

  const resetForm = () => {
    reset();
    setFile(null);
  };

  const onSubmit = async (values) => {
    if (!values.image) {
      toast({
        title: "Error",
        description: "Image is required",
        status: "error",
      });
      return;
    }
    if (!account) {
      toast({
        title: "Error",
        description: "Please connect to your wallet",
        status: "error",
      });
      return;
    }
    setShowExitPrompt(true);
    const result = await Pinata.pinJSONToIPFS(values);
    if (result) {
      dispatch({ type: "mint_sending" });
      const mintTx = await callWithGasPrice(nftContract, "createToken", [
        `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      ]);
      const mintReceipt = await mintTx.wait();
      if (mintReceipt.status) {
        dispatch({ type: "mint_receipt" });
        const event = mintReceipt.events[0];
        const value = event.args[2];
        const tokenId = value.toNumber();
        const price = utils.parseUnits(values.price, "ether");
        dispatch({ type: "listing_sending" });
        const listingPrice = await marketplaceContract.getListingPrice();
        const listingTx = await callWithGasPrice(
          marketplaceContract,
          "createMarketItem",
          [NFT_CONTRACT, tokenId, price],
          {
            value: listingPrice.toString(),
          }
        );
        const listingReceipt = await listingTx.wait();
        if (listingReceipt.status) {
          dispatch({ type: "listing_recept" });
          toast({
            title: "Created successfully",
            status: "success",
            description: "This may take some time to show up",
          });
          mutate(queryMarketArtworks(false));
          resetForm();
          onClose();
        } else {
          dispatch({ type: "listing_error" });
          toast({
            title: "Error",
            status: "error",
            description: "Marketplace transaction error",
          });
        }
      } else {
        dispatch({ type: "mint_error" });
        toast({
          title: "Error",
          status: "error",
          description: "Transaction error",
        });
      }
    }
    setShowExitPrompt(false);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalContent>
          <ModalHeader>New Artwork</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              id="file"
              as={Flex}
              direction="column"
              alignItems="center"
            >
              <Image
                boxSize="160px"
                borderRadius="lg"
                src={file}
                fallback={
                  <Flex
                    borderRadius="lg"
                    border="1px"
                    borderStyle="dashed"
                    w="160px"
                    h="160px"
                    borderColor="gray.100"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {state.uploadState === "loading" && <Spinner />}
                  </Flex>
                }
                alt="File"
              />
              <Button
                onClick={handleBrowserFile}
                leftIcon={<Icon as={BiCloudUpload} />}
                mt="4"
                colorScheme="purple"
                disabled={isSubmitting || state.uploadState === "loading"}
              >
                Upload photo
              </Button>
              <Input
                onChange={handleFileChange}
                ref={fileRef}
                type="file"
                hidden
                disabled={isSubmitting}
              />
            </FormControl>
            <FormControl
              isDisabled={isSubmitting}
              isInvalid={errors.name}
              id="name"
            >
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input
                id="name"
                placeholder="name"
                type="text"
                {...register("name", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isDisabled={isSubmitting} mt="4" id="description">
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                placeholder="Description"
                type="text"
                {...register("description")}
              />
            </FormControl>
            <FormControl isDisabled={isSubmitting} mt="4" id="price">
              <FormLabel htmlFor="price">Price</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<Icon as={FaEthereum} />}
                />
                <NumberInput width="full" max={0.01} min={0.001} step={0.001}>
                  <NumberInputField
                    pl="8"
                    id="description"
                    {...register("price", {
                      required: "This is required",
                    })}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
              <FormHelperText>
                Min: 0.001, max: 0.01. Listing fee: 0.001
              </FormHelperText>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="purple"
              loadingText={`${state.mintState === "loading" ? "Minting" : ""}${
                state.listingState === "loading" ? "Listing" : ""
              }`}
              isLoading={isSubmitting}
              type="submit"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}

export default MintModal;
