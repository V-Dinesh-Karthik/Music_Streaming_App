import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { truncateString } from "@/util/truncateString";
import { useStateProvider } from "@/util/stateProvider";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

const spotifyApiUrl = "https://api.spotify.com/v1";

const MusicView = () => {
  const [newReleases, setNewReleases] = useState();

  const navigate = useNavigate();

  const { state } = useStateProvider();

  const { token } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = token as string;
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.get(
          `${spotifyApiUrl}/browse/new-releases`,
          {
            headers,
          }
        );
        console.log("Albums:", response.data);
        setNewReleases(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(
          "Error fetching albums:",
          axiosError.response ? axiosError.response.data : axiosError.message
        );
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleClick = (id: string) => {
    navigate(`/home/album/${id}`);
  };

  return (
    <div className="grid grid-rows-5">
      <div className="flex justify-between items-center row-span-1 pt-4">
        <h1 className="text-xl">New Releases</h1>
        <Button
          variant={"ghost"}
          onClick={() => navigate(`/home/showall`, { replace: true })}
        >
          Show all
        </Button>
      </div>
      <div className="flex  row-span-4 gap-x-9">
        {newReleases?.albums.items
          .slice(0, 5)
          .map((item: any, index: number) => (
            <div className="flex w-48" key={index}>
              <Card className=" flex justify-center items-center border-y-2 h-48 overflow-hidden">
                <Button
                  variant="ghost"
                  className="w-full h-full"
                  key={index}
                  onClick={() => {
                    handleClick(item.id);
                    onCardClick();
                  }}
                >
                  <CardContent className="flex flex-col pt-3">
                    <img
                      src={item?.images[0].url}
                      className="w-32 h-32 object-contain"
                    />
                    <p className="text-center " key={index}>
                      {truncateString(item.name, 25)}
                    </p>
                  </CardContent>
                </Button>
              </Card>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MusicView;
