import Sidebar from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import MusicView from "@/components/musicview";
import MusicFeatured from "@/components/musicviewFeatured";
import { useStateProvider } from "@/util/stateProvider";
import { useEffect, useState } from "react";
import { ActionTypes } from "@/util/actions";
import { Outlet, useLocation, useParams } from "react-router-dom";
import WebFont from "webfontloader";
import MusicControl from "@/components/musicontrol";
import axios from "axios";

const spotifyApiUrl = "https://api.spotify.com/v1";

const Home = () => {
  const { state, dispatch } = useStateProvider();

  const { token } = state;

  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Poppins", "Oswald", "Inria Sans"],
      },
    });
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const accessToken = token as string;
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };
        const response = await axios.get(`${spotifyApiUrl}/me`, {
          headers,
        });
        const userInfo = {
          userId: response.data.id,
          userUrl: response.data.external_urls.spotify,
          name: response.data.display_name,
        };
        dispatch({ type: ActionTypes.SET_USER, payload: userInfo });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    if (token) {
      getUserInfo();
    }
  }, [token, dispatch]);

  useEffect(() => {
    const getPlaybackState = async () => {
      const accessToken = token as string;
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };
      const { data } = await axios.get(`${spotifyApiUrl}/me/player`, {
        headers,
      });
      dispatch({
        type: ActionTypes.SET_PLAYER_STATE,
        payload: data.is_playing,
      });
    };

    getPlaybackState();
  }, [token, dispatch]);

  return (
    <div className="flex space-x-2 pr-3 pt-3">
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex w-full">
          <Card className="w-full h-[95vh]">
            <CardContent className="grid grid-rows-2">
              {!id &&
                location.pathname !== "/home/search" &&
                location.pathname !== "/home/showall" && (
                  <div>
                    <MusicView />
                    <MusicFeatured />
                  </div>
                )}
              {(id ||
                location.pathname === "/home/search" ||
                location.pathname === "/home/showall") && <Outlet />}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col absolute inset-x-0 bottom-0">
          <MusicControl />
        </div>
      </div>
    </div>
  );
};

export default Home;
