import { ActionTypes } from "@/util/actions";
import { useStateProvider } from "@/util/stateProvider";
import axios from "axios";
import { DiscAlbum } from "lucide-react";
import { useEffect } from "react";

const spotifyApiUrl = "https://api.spotify.com/v1";

const CurrentTrack = () => {
  const { state, dispatch } = useStateProvider();

  const { token, currentPlaying } = state;

  useEffect(() => {
    const compareTracks = (track1, track2) => {
      if (!track1 || !track2) return false;
      return track1.id === track2.id;
    };
    const getCurrentTrack = async () => {
      const accessToken = token as string;
      const headers = {
        Authorization: `Bearer ${accessToken} `,
      };
      const response = await axios.get(
        `${spotifyApiUrl}/me/player/currently-playing`,
        { headers }
      );
      console.log(response.data);
      if (
        response.data !== "" &&
        !compareTracks(response.data.item, currentPlaying)
      ) {
        const currentlyPlaying = {
          id: response.data.item.id,
          name: response.data.item.name,
          artists: response.data.item.artists.map((artist) => artist.name),
          image: response.data.item.album.images[2].url,
          duration: response.data.item.duration_ms,
        };

        dispatch({ type: ActionTypes.SET_PLAYING, payload: currentlyPlaying });
      }
    };

    if (token) {
      getCurrentTrack();
    }
  }, [token, dispatch, currentPlaying]);

  return (
    <div>
      {currentPlaying && (
        <div className="pl-3 flex space-x-2">
          <div className="">
            <img src={currentPlaying.image} width="65" height="65" />
          </div>
          <div className="flex flex-col">
            <p>{currentPlaying.name}</p>
            <p>{currentPlaying.artists.join(", ")}</p>
          </div>
        </div>
      )}

      {!currentPlaying && (
        <div className="pl-4 flex space-x-2">
          <div className="">
            <DiscAlbum size="48" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentTrack;
