import CurrentTrack from "./currentTrack";
import PlayerControls from "./playercontrol";
import Volume from "./volume";

const MusicControl = () => {
  return (
    <div className="flex items-center justify-between bg-orange-50 w-auto h-[5rem]">
      <CurrentTrack />
      <PlayerControls />
      <Volume />
    </div>
  );
};

export default MusicControl;
