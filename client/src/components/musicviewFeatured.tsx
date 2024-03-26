import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { truncateString } from "@/util/truncateString";
import { Skeleton } from "@/components/ui/skeleton";
import axios, { AxiosError } from "axios";
import { useStateProvider } from "@/util/stateProvider";
import { useNavigate } from "react-router-dom";

const spotifyApiUrl = "https://api.spotify.com/v1";

const MusicFeatured = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState<any>();
  const { state } = useStateProvider();
  const { token } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = token as string;
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(
          `${spotifyApiUrl}/browse/featured-playlists`,
          {
            headers,
          }
        );
        console.log(response.data);
        setFeaturedPlaylists(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          console.error(
            `Couldn't fetch featured playlists`,
            axiosError.response.data
          );
        } else {
          console.error("Non Axios Error: ", axiosError.message);
        }
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleClick = (id: string) => {
    navigate(`/home/playlist/${id}`, { replace: true });
  };

  return (
    <div className="grid grid-rows-5">
      <div className="flex justify-between items-center row-span-1">
        <h1 className="text-xl">Popular Playlists</h1>
        <Button
          variant={"ghost"}
          onClick={() => navigate("/home/search", { replace: true })}
        >
          Show all
        </Button>
      </div>
      <div className="flex row-span-4 gap-x-9">
        {featuredPlaylists &&
        featuredPlaylists.playlists &&
        featuredPlaylists.playlists.items
          ? featuredPlaylists.playlists.items
              .slice(0, 5)
              .map((item: any, index: number) => (
                <div className="flex w-48" key={index}>
                  <Card className="flex justify-center items-center border-y-2 h-48 overflow-hidden">
                    <Button
                      variant="ghost"
                      className="w-full h-full"
                      key={index}
                      onClick={() => handleClick(item.id)}
                    >
                      <CardContent className="flex flex-col pt-3">
                        <img
                          src={item?.images[0].url}
                          className="w-32 h-32 object-contain"
                        />
                        <span className="text-center text-ellipsis" key={index}>
                          {truncateString(item.name, 25)}
                        </span>
                      </CardContent>
                    </Button>
                  </Card>
                </div>
              ))
          : Array.from({ length: 5 }, (_, index) => (
              <div className="flex flex-col space-y-3" key={index}>
                <Skeleton className="h-[48px] w-[48px] rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[48px]" />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default MusicFeatured;
