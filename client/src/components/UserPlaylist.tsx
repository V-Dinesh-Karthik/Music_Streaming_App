import { useStateProvider } from "@/util/stateProvider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const UserPlaylist = () => {
  const spotifyApiUrl = "https://api.spotify.com/v1";

  const { state } = useStateProvider();
  const { token } = state;
  const [userPlaylist, setUserPlaylist] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserPlaylist = async () => {
      const accessToken = token as string;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${spotifyApiUrl}/me/playlists`, {
        headers,
      });
      console.log(response.data);
      setUserPlaylist(response.data);
    };

    if (token) {
      getUserPlaylist();
    }
  }, [token]);

  const handleClick = (id: string) => {
    navigate(`playlist/${id}`, { replace: true });
    // if (onCCClick) {
    //   onCCClick();
    // }
  };

  return (
    <div
      className="flex flex-col overflow-y-auto h-[29rem] space-y-2 pt-2"
      style={{ scrollbarWidth: "none" }}
    >
      <div>
        <h1 className="text-lg">Playlists:</h1>
      </div>
      {userPlaylist?.items.map((playlist, index) => (
        <Button
          key={index}
          className="inline-block"
          style={{ width: "auto", height: "auto" }}
          variant="ghost"
          onClick={() => handleClick(playlist.id)}
        >
          {playlist.images && playlist.images.length > 0 && (
            <img
              key={index}
              src={playlist.images[0].url}
              width="100"
              height="100"
              alt={`Playlist ${index}`}
            />
          )}
        </Button>
      ))}
    </div>
  );
};

export default UserPlaylist;
