import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import axios from "axios";
import { Dot, Pause, Play, SearchIcon, Timer } from "lucide-react";
import { useEffect, useState } from "react";

function millisToMinutesAndSeconds(millis: number): string {
  const minutes: number = Math.floor(millis / 60000);
  const seconds: string = ((millis % 60000) / 1000).toFixed(0);
  return `${seconds === "60" ? minutes + 1 : minutes}:${
    seconds.length === 1 ? "0" + seconds : seconds
  }`;
}

const Search = () => {
  const spotifyApiUrl = "https://api.spotify.com/v1";
  const [value, setValue] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [results, setResults] = useState();
  const { state, dispatch } = useStateProvider();
  const { token, playerState } = state;
  const [playlist, setPlaylist] = useState();

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
    if (!inputValue?.trim() || !value || !token) return;

    const fetchResults = async () => {
      const accessToken = token as string;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const response = await axios.get(`${spotifyApiUrl}/search`, {
        params: { q: inputValue, type: value },
        headers,
      });
      console.log(response.data);
      setResults(response.data);
    };

    fetchResults();
  }, [inputValue, value, token]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center">
        <div className="relative pt-6">
          <Input
            placeholder="What do you want to search?"
            className="pl-10 pr-4 py-2 rounded-xl w-96"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-2 pt-6">
            <SearchIcon className="" />
          </div>
        </div>
        <div className="ml-4 pt-6">
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select a type to search" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Type</SelectLabel>
                <SelectItem value="track">Track</SelectItem>
                <SelectItem value="album">Album</SelectItem>
                <SelectItem value="artist">Artist</SelectItem>
                <SelectItem value="playlist">Playlist</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div></div>
      </div>
      {value === "track" && results && (
        <div className="flex space-x-4">
          <div className="space-y-3">
            <p>Top Search:</p>
            <Card
              className={`flex ${
                results?.tracks.items[0].name.length > 20 ? "w-64" : "w-48"
              }`}
            >
              <Button
                className="inline-block"
                style={{ width: "auto", height: "auto" }}
                variant="ghost"
              >
                <CardContent className="flex flex-col pt-6">
                  <img
                    src={results?.tracks.items[0].album.images[0].url}
                    className="w-32"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold">
                      {results?.tracks.items[0].name}
                    </h1>

                    <div className="flex">
                      <p className="text-slate-700">Song</p>
                      <Dot />
                      <p>{results?.tracks.items[0].artists[0].name}</p>
                    </div>
                  </div>
                </CardContent>
              </Button>
            </Card>
          </div>
          <div className="flex-grow">
            <p>Songs:</p>
            <Table>
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
                {results?.tracks.items.slice(0, 5).map((track, index) => (
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
                          {playerState === true &&
                          index === currentSongIndex ? (
                            <Pause width="21" />
                          ) : (
                            <Play width="21" />
                          )}
                        </Button>
                      ) : (
                        index + 1
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <img
                          src={track.album.images[0].url}
                          width="45"
                          height="45"
                          className="mr-4"
                        />
                        <div className="flex flex-col">
                          <p>{track.name}</p>
                          <p>
                            {track.artists
                              .map((artist) => artist.name)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{track.album.name}</TableCell>
                    <TableCell>{track.added_at === "" ? "" : ""}</TableCell>
                    <TableCell>
                      {millisToMinutesAndSeconds(track.duration_ms)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      {value === "album" && (
        <div className="flex flex-col pl-2">
          <p>Albums:</p>
          <div
            className="flex flex-wrap overflow-y-auto h-[35rem] w-[73em]"
            style={{ scrollbarWidth: "none" }}
          >
            {results?.albums.items.map((album, index) => (
              <Card key={index} className="w-48 border-hidden">
                <Button
                  className="inline-block"
                  style={{ width: "auto", height: "auto" }}
                  variant="ghost"
                >
                  <CardContent className="p-0">
                    <img
                      src={album.images[0].url}
                      className="object-cover w-full h-full"
                    />
                  </CardContent>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
      {value === "artist" && <div>Artist</div>}
      {value === "playlist" && <div>Playlists</div>}
    </div>
  );
};

export default Search;
