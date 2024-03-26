import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStateProvider } from "@/util/stateProvider";
import axios, { AxiosError } from "axios";
import { Dot, Pause, Play, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function millisToMinutesAndSeconds(millis: number): string {
  const minutes: number = Math.floor(millis / 60000);
  const seconds: string = ((millis % 60000) / 1000).toFixed(0);
  return `${seconds === "60" ? minutes + 1 : minutes}:${
    seconds.length === 1 ? "0" + seconds : seconds
  }`;
}

const Album = () => {
  const spotifyApiUrl = "https://api.spotify.com/v1";

  const { state, dispatch } = useStateProvider();
  const [album, setAlbum] = useState();
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
            context_uri: `spotify:album:${playlistId}`,
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
        dispatch({
          type: ActionTypes.SET_PLAYING,
          payload: currentlyPlaying,
        });
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
    const fetchAlbum = async () => {
      try {
        const accessToken = token as string;
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(`${spotifyApiUrl}/albums/${id}`, {
          headers,
        });
        console.log(response.data);
        setAlbum(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(
          "Error fetching albums:",
          axiosError.response ? axiosError.response.data : axiosError.message
        );
      }
    };

    fetchAlbum();
  }, [token, id]);

  return (
    <div>
      <div className="flex space-x-6 items-center pt-4">
        {album?.images && album.images.length > 0 && (
          <img src={album.images[0].url} className="w-56" />
        )}
        <div className="flex flex-col">
          <p className="capitalize">{album?.album_type}</p>
          <p className="text-2xl">{album?.name}</p>

          <div className="flex">
            <p>{album?.artists[0].name}</p>
            <Dot />
            <p>{album?.release_date.substring(0, 4)}</p>
          </div>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>
                <Timer />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {album?.tracks.items.map((item, index) => (
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
                    <div className="flex flex-col">
                      <p>{item.name}</p>
                      {item.artists.map((artist) => artist.name).join(", ")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {millisToMinutesAndSeconds(item.duration_ms)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Album;
