import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionTypes } from "@/util/actions";
import { useStateProvider } from "@/util/stateProvider";
import axios, { AxiosError } from "axios";
import { Pause, Play, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function millisToMinutesAndSeconds(millis: number): string {
  const minutes: number = Math.floor(millis / 60000);
  const seconds: string = ((millis % 60000) / 1000).toFixed(0);
  return `${seconds === "60" ? minutes + 1 : minutes}:${
    seconds.length === 1 ? "0" + seconds : seconds
  }`;
}

export const Playlist = () => {
  const spotifyApiUrl = "https://api.spotify.com/v1";

  const { state, dispatch } = useStateProvider();

  const [playlist, setPlaylist] = useState();

  const { token, playerState } = state;

  const { id } = useParams();

  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const [currentSongIndex, setCurrentSongIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setHoveredRow(index);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const playSong = async (songIndex: number) => {
    if (token) {
      const playerStatus = playerState ? "pause" : "play";
      const accessToken = token as string;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const playlistId = playlist?.id;
      const isCurrentSong = currentSongIndex === songIndex;

      if (isCurrentSong && playerState === true) {
        await axios.put(`${spotifyApiUrl}/me/player/pause`, {}, { headers });
        setCurrentSongIndex(null);
        dispatch({ type: ActionTypes.SET_PLAYER_STATE, payload: false });
      } else {
        await axios.put(
          `${spotifyApiUrl}/me/player/${playerStatus}`,
          {
            context_uri: `spotify:playlist:${playlistId}`,
            offset: { position: songIndex },
          },
          { headers }
        );

        const currentlyPlaying = {
          id: playlist?.tracks.items[songIndex].track.id,
          name: playlist?.tracks.items[songIndex].track.name,
          artists: playlist?.tracks.items[songIndex].track.album.artists.map(
            (artist) => artist.name
          ),
          image: playlist?.tracks.items[songIndex].track.album.images[0].url,
          duration_ms: playlist?.tracks.items[songIndex].track.duration_ms,
        };
        dispatch({ type: ActionTypes.SET_PLAYING, payload: currentlyPlaying });
        dispatch({ type: ActionTypes.SET_PLAYLIST_ID, payload: playlistId });
        dispatch({ type: ActionTypes.SET_PLAYER_STATE, payload: true });

        setCurrentSongIndex(songIndex);
      }
    }
  };

  const handlePlayClick = (songIndex: number) => {
    playSong(songIndex);
  };

  useEffect(() => {
    const fetchPlaylistdata = async () => {
      try {
        const accessToken = token as string;
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(`${spotifyApiUrl}/playlists/${id}`, {
          headers,
        });
        console.log("Playlist data: ", response.data);
        setPlaylist(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(
          "Error fetching albums:",
          axiosError.response ? axiosError.response.data : axiosError.message
        );
      }
    };

    fetchPlaylistdata();
  }, [token, id]);

  return (
    <div
      className="overflow-y-auto h-[38rem] w-[67rem] scroll-smooth"
      style={{ scrollbarWidth: "none", width: "100%" }}
    >
      {playlist && (
        <div className="flex items-center space-x-6 pt-6">
          {playlist.images && playlist.images.length > 0 && (
            <img src={playlist.images[0].url} className="w-56" />
          )}
          <div className="flex flex-col">
            <p className="text-2xl">{playlist.name}</p>
            <p>{playlist.description}</p>
            {playlist.owner && <p>Owner: {playlist.owner.display_name}</p>}
          </div>
        </div>
      )}
      <div className="">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Album</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>
                <Timer />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playlist?.tracks.items.map((item, index) => (
              <TableRow
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <TableCell className="relative">
                  {hoveredRow === index ? (
                    <Button
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      variant="ghost"
                      onClick={() => handlePlayClick(index)}
                    >
                      {playerState === true && index === currentSongIndex ? (
                        <Pause width="21" />
                      ) : (
                        <Play width="21" />
                      )}
                    </Button>
                  ) : (
                    index + 1
                  )}
                </TableCell>
                <TableCell className="">
                  <div className="flex items-center">
                    <img
                      src={item.track.album.images[0].url}
                      width="45"
                      height="45"
                      className="mr-4"
                    />
                    <div className="flex flex-col">
                      <p>{item.track.name}</p>
                      {item.track.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.track.name}</TableCell>
                <TableCell>{item.added_at}</TableCell>
                <TableCell>
                  {millisToMinutesAndSeconds(item.track.duration_ms)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
