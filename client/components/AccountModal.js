import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import truncateHash from "../utils/truncateHash";
import { useWeb3React } from "@web3-react/core";

function AccountModal({ isOpen, onClose }) {
  const { account } = useWeb3React();

  return (
    <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody py="4" textAlign="center">
          <Text
            fontWeight="bold"
            fontSize="2xl"
            borderRadius="lg"
            p={4}
            bg="gray.800"
          >
            {truncateHash(account ?? "", 8, 8)}
          </Text>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AccountModal;
