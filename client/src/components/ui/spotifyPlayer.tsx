import { useStateProvider } from "@/util/stateProvider";
import React, { useEffect } from "react";

const SpotifyPlayer: React.FC = () => {
  const { state } = useStateProvider();
  const { token } = state;
  useEffect(() => {
    const initializeSpotifyPlayer = async () => {
      if (!token) return;
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const accesstoken = token as string; // Replace with your access token
          const player = new Spotify.Player({
            name: "My Web Playback SDK Player",
            getOAuthToken: (cb) => {
              cb(accesstoken);
            },
          });

          // Error handling
          player.addListener("initialization_error", ({ message }) => {
            console.error(message);
          });
          player.addListener("authentication_error", ({ message }) => {
            console.error(message);
          });
          player.addListener("account_error", ({ message }) => {
            console.error(message);
          });
          player.addListener("playback_error", ({ message }) => {
            console.error(message);
          });

          // Playback status updates
          player.addListener("player_state_changed", (state) => {
            console.log(state);
          });

          // Ready
          player.addListener("ready", ({ device_id }) => {
            console.log("Ready with Device ID", device_id);
          });

          // Connect to the player
          player
            .connect()
            .then((success) => {
              if (success) {
                console.log(
                  "The Web Playback SDK successfully connected to Spotify!"
                );
              }
            })
            .catch((error) => {
              console.error(
                "Unable to connect to the Web Playback SDK:",
                error
              );
            });
        };
      };
    };

    initializeSpotifyPlayer();
  }, [token]);

  return <div>This is the Spotify player component.</div>;
};

export default SpotifyPlayer;
