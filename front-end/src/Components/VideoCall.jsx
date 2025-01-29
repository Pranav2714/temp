import React, { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { Link } from "react-router-dom";


const VideoCall = ({ appId, token, channelName, uid }) => {
  const localVideoRef = useRef(null);
  const remoteContainerRef = useRef(null);
  const client = useRef(null);
  const localTracks = useRef({});
  const screenShareTrack = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleMute = async () => {
    if (localTracks.current.microphoneTrack) {
      if (isMuted) {
        await localTracks.current.microphoneTrack.setMuted(false);
        setIsMuted(false);
      } else {
        await localTracks.current.microphoneTrack.setMuted(true);
        setIsMuted(true);
      }
    }
  };

  const toggleVideo = async () => {
    if (localTracks.current.cameraTrack) {
      if (isVideoOff) {
        await localTracks.current.cameraTrack.setEnabled(true);
        setIsVideoOff(false);
      } else {
        await localTracks.current.cameraTrack.setEnabled(false);
        setIsVideoOff(true);
      }
    }
  };

  const endCall = () => {
    setShowModal(true);
  };

  const confirmLeave = async () => {
    if (client.current) {
      await client.current.leave();
      if (localTracks.current.cameraTrack) {
        localTracks.current.cameraTrack.stop();
        localTracks.current.cameraTrack.close();
      }
      if (localTracks.current.microphoneTrack) {
        localTracks.current.microphoneTrack.stop();
        localTracks.current.microphoneTrack.close();
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const startScreenShare = async () => {
    if (!isSharingScreen) {
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      screenShareTrack.current = screenTrack;

      await client.current.unpublish(localTracks.current.cameraTrack);
      await client.current.publish(screenTrack);

      setIsSharingScreen(true);
      screenTrack.play(remoteContainerRef.current);
    }
  };

  const stopScreenShare = async () => {
    if (isSharingScreen) {
      await client.current.unpublish(screenShareTrack.current);
      await client.current.publish(localTracks.current.cameraTrack);

      screenShareTrack.current.stop();
      screenShareTrack.current.close();
      setIsSharingScreen(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  
        client.current.on("user-published", async (user, mediaType) => {
          await client.current.subscribe(user, mediaType);
          if (mediaType === "video") {
            const remotePlayer = document.createElement("div");
            remotePlayer.id = `remote-player-${user.uid}`;
            remotePlayer.style.width = "400px";
            remotePlayer.style.height = "300px";
            remoteContainerRef.current.append(remotePlayer);
            user.videoTrack.play(remotePlayer);
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });
  
        client.current.on("user-unpublished", (user) => {
          const remotePlayer = document.getElementById(`remote-player-${user.uid}`);
          if (remotePlayer) {
            remotePlayer.remove();
          }
        });
  
        // Log the values to verify
        console.log("Joining channel:", channelName);
        console.log("Using token:", token);
        console.log("User ID:", uid);
  
        await client.current.join(appId, channelName, token, uid || null);
  
        const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        localTracks.current = { microphoneTrack, cameraTrack };
  
        cameraTrack.play(localVideoRef.current);
        await client.current.publish([microphoneTrack, cameraTrack]);
      } catch (error) {
        console.error("Error joining Agora channel:", error);
      }
    };
  
    init();
  
    return () => {
      const cleanup = async () => {
        localTracks.current.microphoneTrack?.stop();
        localTracks.current.cameraTrack?.stop();
        localTracks.current.microphoneTrack?.close();
        localTracks.current.cameraTrack?.close();
        await client.current.leave();
      };
  
      cleanup();
    };
  }, [appId, token, channelName, uid]);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl mb-4">Video Call</h2>
      <div className="flex flex-row space-x-4">
        <div ref={localVideoRef} className="w-96 h-72 border bg-gray-300"></div>
        <div ref={remoteContainerRef}></div>
      </div>

      <div className="mt-4 space-x-4">
        <button
          onClick={toggleMute}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {isMuted ? "Unmute Mic" : "Mute Mic"}
        </button>
        <button
          onClick={toggleVideo}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {isVideoOff ? "Turn Video On" : "Turn Video Off"}
        </button>
        {isSharingScreen ? (
          <button
            onClick={stopScreenShare}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Stop Screen Share
          </button>
        ) : (
          <button
            onClick={startScreenShare}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Start Screen Share
          </button>
        )}
        <button
          onClick={endCall}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          End Call
        </button>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md text-center">
            <h3>Are you sure you want to leave the call?</h3>
            <button
              onClick={confirmLeave}
              className="bg-blue-500 text-white px-6 py-2 rounded-md"
            >
              Yes
            </button>
            <Link to="/video" onClick={closeModal}>
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-md ml-4"
              >
                No
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
