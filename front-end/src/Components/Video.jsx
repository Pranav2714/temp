import React, { useState } from "react";
import VideoCall from "./VideoCall";

const Video = () => {
  const [appId] = useState("4e719eb97a564dcda1b741cdf8170c5a"); 
  const [channelName, setChannelName] = useState("");
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinChannel = async () => {
    if (!channelName) {
      alert("Please enter a channel name.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/generate-token?channelName=${channelName}&uid=${uid || 0}`
      );
      const data = await response.json();
  
      if (data.token) {
        setToken(data.token);
        setIsJoined(true);
      } else {
        alert("Failed to generate token.");
      }
    } catch (error) {
      console.error("Failed to fetch token:", error);
      alert("Failed to join the channel. Please try again.");
    }
  };

  return (
    <div>
      <h2>Join a Video Call</h2>
      {!isJoined ? (
        <div>
          <input
            type="text"
            placeholder="Enter Channel Name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter UID (optional)"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          <button onClick={handleJoinChannel}>Join</button>
        </div>
      ) : (
        <VideoCall appId={appId} token={token} channelName={channelName} uid={uid} />
      )}
    </div>
  );
};

export default Video;
