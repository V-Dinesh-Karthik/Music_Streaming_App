import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Home from "../assets/home.png";
import UserPlaylist from "./UserPlaylist";
import { SearchIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Toggle } from "./ui/toggle";
// import Navbar from "./navbar";
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActiveButton = (pathname) => location.pathname.includes(pathname);

  const handleHomePress = () => {
    navigate("/home", { replace: true });
  };

  const handleSearchPress = () => {
    navigate("/home/search", { replace: true });
  };

  return (
    <div className="flex space-x-2 h-screen">
      <div className="space-y-3 pl-2">
        <Card className="w-auto">
          <CardContent className="flex flex-col space-y-2 pt-2 pb-2 pl-1 pr-1">
            <Toggle
              variant="default"
              className={`space-x-5`}
              pressed={
                isActiveButton("/home") && !isActiveButton("/home/search")
              }
              onPressedChange={handleHomePress}
            >
              <img src={Home} width="35" />
              <h1 className="text-xl">Home</h1>
            </Toggle>
            <Toggle
              variant="default"
              className="space-x-5"
              pressed={isActiveButton("/search")}
              onPressedChange={handleSearchPress}
            >
              {/* <img src={Search} width="35" /> */}
              <SearchIcon size="36px" />
              <h1 className="text-xl">Search</h1>
            </Toggle>
          </CardContent>
        </Card>
        {/* 82.3% */}
        <Card className="h-[75vh]">
          <CardContent>
            <UserPlaylist />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
