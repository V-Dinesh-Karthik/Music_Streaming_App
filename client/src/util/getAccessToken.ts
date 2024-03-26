import axios, { AxiosError } from "axios";

const clientId = "8fe777d15b174d1f81fb220b15194834";
const clientSecret = "f2886d7d3e1a45cca133f67c86a971c6";
const spotifyAccountsUrl = "https://accounts.spotify.com/api/token";

async function getAccessToken() {
  const authString = btoa(`${clientId}:${clientSecret}`);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${authString}`,
  };
  const data =
    "grant_type=client_credentials&scope=user-read-currently-playing";

  try {
    const response = await axios.post(spotifyAccountsUrl, data, { headers });
    return response.data.access_token;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      console.error("Error fetching access token:", axiosError.response.data);
    } else {
      console.error("Error fetching access token:", axiosError.message);
    }
    throw error;
  }
}

export default getAccessToken;
