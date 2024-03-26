import {
  LucideVolume,
  Volume1,
  Volume2,
  VolumeIcon,
  VolumeX,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import axios from "axios";
import { useStateProvider } from "@/util/stateProvider";

const spotifyApiUrl = "https://api.spotify.com/v1";

const Volume = () => {
  const [volume, setVolume] = useState<number>(50);
  const { state } = useStateProvider();
  const { token } = state;

  const handleVolumeChange = async (newVolume: number) => {
    try {
      const accessToken = token as string;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };
      await axios.put(
        `${spotifyApiUrl}/me/player/volume`,
        {},
        { params: { volume_percent: newVolume }, headers }
      );
      setVolume(newVolume);
    } catch (error) {
      console.error("Error updating volume:", error);
    }
  };
  return (
    <div className="flex items-center space-x-2">
      <div>
        {volume === 0 ? <VolumeX /> : volume <= 35 ? <Volume1 /> : <Volume2 />}
      </div>
      <div className="w-44 pr-10">
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          onValueChange={(v) => handleVolumeChange(v[0])}
        />
      </div>
    </div>
  );
};

export default Volume;
