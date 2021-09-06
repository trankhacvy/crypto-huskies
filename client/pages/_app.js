import "../styles/index.css";
import Head from "next/head";
import { ChakraProvider, CSSReset, extendTheme } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Box } from "@chakra-ui/react";
import Header from "../components/Header";
// import Footer from "../components/Footer";
import { useEagerConnect, useInactiveListener } from "../hooks/useEagerConnect";
import { getLibrary } from "../utils/connector";

const AppWrapper = ({ children }) => {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  return (
    <Box as="main" maxW="container.lg" mx="auto">
      {children}
    </Box>
  );
};

const theme = extendTheme({
  colors: {
    primary: "#0d0415",
  },
  styles: {
    global: {
      "html, body": {
        backgroundColor: "primary",
        fontFamily: "'Lato', sans-serif",
        color: "#bfbfbf",
      },
    },
  },
  components: {
    Modal: {
      baseStyle: {
        dialog: {
          backgroundColor: "rgba(22,21,34)",
        },
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CryptoHuskies | Collect and bread digital dogs</title>
        <meta name="theme-color" content="#462D17" />
        <meta name="viewport" content="width=device-width" />
        <link rel="shortcut icon" href="/icon.svg" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ChakraProvider theme={theme}>
          <CSSReset />
          <Header />
          <AppWrapper>
            <Component {...pageProps} />
          </AppWrapper>
          {/* <Footer /> */}
        </ChakraProvider>
      </Web3ReactProvider>
    </>
  );
}

export default MyApp;
