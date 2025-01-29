import { useState } from "react";
import { useClient } from "../assets/settings";
import { IoIosMic } from "react-icons/io";
import { IoIosMicOff } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import { IoExit } from "react-icons/io5";

export default function Controls(props) {
  const client = useClient();
  const { tracks, setStart, setInCall } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => ({ ...ps, audio: !ps.audio }));
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => ({ ...ps, video: !ps.video }));
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    if (typeof setStart === "function") {
      setStart(false);
    } else {
      console.error("setStart is not a function:", setStart);
    }
    if (typeof setInCall === "function") {
      setInCall(false);
    } else {
      console.error("setInCall is not a function:", setInCall);
    }
  };

  return (
    <div className="flex flex-row gap-4">
      <button
        className={`px-4 py-2 rounded-full text-white ${
          trackState.audio ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"
        }`}
        onClick={() => mute("audio")}
      >
        {trackState.audio ? <IoIosMic size={24} /> : <IoIosMicOff size={24} />}
      </button>

      <button
        className={`px-4 py-2 rounded-full text-white ${
          trackState.video ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"
        }`}
        onClick={() => mute("video")}
      >
        {trackState.video ? <FaVideo size={24} /> : <FaVideoSlash size={24} />}
      </button>

      <button
        className="px-4 py-2 rounded-full text-white bg-gray-500 hover:bg-gray-600 flex items-center gap-2"
        onClick={leaveChannel}
      >
        Leave
        <IoExit size={24} />
      </button>
    </div>
  );
}
