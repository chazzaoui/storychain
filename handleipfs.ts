import axios from 'axios';

const key = process.env.NEXT_PUBLIC_REACT_APP_PINATA_KEY;
const secret = process.env.NEXT_PUBLIC_REACT_APP_PINATA_SECRET;
export const pinJSONToIPFS = async (JSONBody: any) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //making axios POST request to Pinata ⬇️
  return axios
    .post(url, JSON.parse(JSONBody), {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret
      }
    })
    .then(function (response) {
      console.log(response.data, 'data');
      return {
        success: true,
        pinataUrl: 'https://gateway.pinata.cloud/ipfs/' + response.data.IpfsHash
      };
    })
    .catch(function (error) {
      return {
        success: false,
        pinataUrl: error
      };
    });
};
