import FormData from "form-data";
import fetcher from "./fetcher";

const baseUrl = "https://api.pinata.cloud";

const pinFileToIPFS = async (file) => {
  try {
    const data = new FormData();
    data.append("file", file);
    const result = await fetcher(`${baseUrl}/pinning/pinFileToIPFS`, {
      body: data,
      maxContentLength: "Infinity",
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
      },
      method: "POST",
    });
    console.log("res", result);
    if (result) {
      return result;
    }
    throw new Error(
      `unknown server response while pinning file to IPFS: ${result}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const pinJSONToIPFS = async (json) => {
  try {
    const endpoint = `${baseUrl}/pinning/pinJSONToIPFS`;
    const result = await fetcher(endpoint, {
      body: JSON.stringify(json),
      headers: {
        "content-type": "application/json",
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_API_SECRET,
      },
      method: "POST",
    });
    console.log("pinJSONToIPFS result", result);
    if (result) {
      return result;
    }
    throw new Error(
      `unknown server response while pinning JSON to IPFS: ${result}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default {
  pinFileToIPFS,
  pinJSONToIPFS,
};
