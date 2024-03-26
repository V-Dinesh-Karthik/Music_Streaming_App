import { useStateProvider } from "@/util/stateProvider";
import {
  PauseCircle,
  PlayCircle,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { ActionTypes } from "@/util/actions";
import { Toggle } from "./ui/toggle";

const spotifyApiUrl = "https://api.spotify.com/v1";

const PlayerControls = () => {
  const { state, dispatch } = useStateProvider();
  const { token, playerState } = state;
  let { repeat } = state;

  const changeState = async () => {
    const playerStatus = playerState ? "pause" : "play";
    const accessToken = token as string;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    await axios.put(
      `${spotifyApiUrl}/me/player/${playerStatus}`,
      {},
      { headers }
    );
    dispatch({ type: ActionTypes.SET_PLAYER_STATE, payload: !playerState });
  };

  const changeTrack = async (type: string) => {
    const accessToken = token as string;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    await axios.post(`${spotifyApiUrl}/me/player/${type}`, {}, { headers });
    const response = await axios.get(
      `${spotifyApiUrl}/me/player/currently-playing?timestamp=${Date.now()}`,
      { headers }
    );

    dispatch({ type: ActionTypes.SET_PLAYER_STATE, payload: true });
    console.log(response.data);
    if (response.data !== "") {
      const currentlyPlaying = {
        id: response.data.item.id,
        name: response.data.item.name,
        artists: response.data.item.artists.map((artist) => artist.name),
        image: response.data.item.album.images[0].url,
      };
      dispatch({ type: ActionTypes.SET_PLAYING, payload: currentlyPlaying });
    } else {
      dispatch({ type: ActionTypes.SET_PLAYING, payload: null });
    }
  };

  const handleShuffle = async () => {
    const { shuffle } = state;
    const accessToken = token as string;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    await axios.put(
      `${spotifyApiUrl}/me/player/shuffle?state=${!shuffle}`,
      {},
      {
        headers,
      }
    );
    dispatch({ type: ActionTypes.SET_SHUFFLE, payload: !shuffle });
  };

  const handleRepeat = async () => {
    repeat = repeat === "off" ? "track" : "off";
    const accessToken = token as string;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    await axios.put(
      `${spotifyApiUrl}/me/player/repeat?state=${repeat}`,
      {},
      { headers }
    );
    dispatch({ type: ActionTypes.SET_REPEAT, payload: repeat });
  };

  return (
    <div className="flex">
      <div>
        <Toggle onPressedChange={handleShuffle}>
          <Shuffle />
        </Toggle>
      </div>
      <div>
        <Button variant={"ghost"} onClick={() => changeTrack("previous")}>
          <SkipBack />
        </Button>
      </div>
      <div>
        <Button variant={"ghost"} onClick={changeState}>
          {playerState ? <PauseCircle /> : <PlayCircle />}
        </Button>
      </div>
      <div>
        <Button variant={"ghost"} onClick={() => changeTrack("next")}>
          <SkipForward />
        </Button>
      </div>
      <div>
        <Toggle onPressedChange={handleRepeat}>
          {repeat === "off" ? <Repeat /> : <Repeat1 />}
        </Toggle>
      </div>
    </div>
  );
};

export default PlayerControls;
