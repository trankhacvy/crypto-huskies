import { useMemo } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaWallet } from "react-icons/fa";
import { GoMarkGithub } from "react-icons/go";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { injected, setupNetwork } from "../utils/connector";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import MintModal from "./MintModal";
import AccountModal from "./AccountModal";

export default function WithSubnavigation() {
  const router = useRouter();
  const { account, activate } = useWeb3React();
  const { isOpen, onToggle } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: onModalClose,
  } = useDisclosure();
  const {
    isOpen: isAccountModalOpen,
    onOpen: openAccountModal,
    onClose: onAccountModalClose,
  } = useDisclosure();

  const handleClick = async () => {
    if (account) {
      router.push("/profile");
    } else {
      activate(injected, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          await setupNetwork();
          activate(injected, (error) => {
            console.error(error);
          });
        } else {
          console.error(error);
        }
      });
    }
  };

  const menuItems = useMemo(
    () => [
      {
        name: "Profile",
        onClick: () => router.push("/profile"),
      },
      {
        name: "Wallet",
        onClick: () => openAccountModal(),
      },
    ],
    []
  );

  return (
    <Box
      as="header"
      sx={{
        background:
          "linear-gradient(90deg,rgba(39,176,230,.2) 0,rgba(250,82,160,.2)) 0 100% no-repeat",
        backgroundSize: "100% 1px",
      }}
    >
      <Flex
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        mx="auto"
        align={"center"}
        maxW="container.lg"
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <NextLink href="/">
            <Flex cursor="pointer" alignItems="center">
              <NextImage
                priority
                src="/icon.svg"
                height={"48px"}
                width={"48px"}
              />
              <Text
                textAlign={useBreakpointValue({ base: "center", md: "left" })}
                ml="2"
                fontSize="xl"
                fontWeight="bold"
              >
                CryptoHuskies
              </Text>
            </Flex>
          </NextLink>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={4}
        >
          {account && (
            <Button
              display={{ base: "none", md: "inline-flex" }}
              fontWeight="semibold"
              colorScheme="purple"
              borderRadius="full"
              onClick={openModal}
              leftIcon={<AddIcon color="white" />}
            >
              Create
            </Button>
          )}
          {account ? (
            <Menu>
              <MenuButton>
                <IconButton
                  onClick={openAccountModal}
                  colorScheme="purple"
                  icon={<Icon as={FaWallet} />}
                />
              </MenuButton>
              <MenuList px={2} bg="rgba(22,21,34)" zIndex="9999">
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.name}
                    _hover={{
                      backgroundColor: "purple",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "md",
                    }}
                    _focus={{}}
                    onClick={item.onClick}
                  >
                    {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          ) : (
            <Button
              display={{ base: "none", md: "inline-flex" }}
              fontWeight="semibold"
              colorScheme="purple"
              borderRadius="full"
              onClick={handleClick}
            >
              Connect Wallet
            </Button>
          )}
          <IconButton
            as={Link}
            href="https://github.com/trankhacvy/crypto-huskies"
            isExternal
            colorScheme="purple"
            icon={<Icon as={GoMarkGithub} />}
          />
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
      <MintModal isOpen={isModalOpen} onClose={onModalClose} />
      <AccountModal isOpen={isAccountModalOpen} onClose={onAccountModalClose} />
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }) => {
  return (
    <Link
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const NAV_ITEMS = [
  {
    label: "Inspiration",
    children: [
      {
        label: "Explore Design Work",
        subLabel: "Trending Design to inspire you",
        href: "#",
      },
      {
        label: "New & Noteworthy",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
  {
    label: "Find Work",
    children: [
      {
        label: "Job Board",
        subLabel: "Find your dream design job",
        href: "#",
      },
      {
        label: "Freelance Projects",
        subLabel: "An exclusive list for contract work",
        href: "#",
      },
    ],
  },
  {
    label: "Learn Design",
    href: "#",
  },
  {
    label: "Hire Designers",
    href: "#",
  },
];
