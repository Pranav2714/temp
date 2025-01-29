import { AgoraVideoPlayer } from "agora-rtc-react";
import { useState, useEffect } from "react";

export default function Video(props) {
  const { users, tracks } = props;
  const [gridSpacing, setGridSpacing] = useState("w-full");

  useEffect(() => {
    
    const spacingClass = users.length + 1 <= 3 ? "w-1/3" : "w-1/4";
    setGridSpacing(spacingClass);
  }, [users, tracks]);

  return (
    <div className="flex flex-wrap h-full">
     
      <div className={`p-2 ${gridSpacing}`}>
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          className="w-full h-full rounded-lg overflow-hidden"
        />
      </div>
      
      {users.length > 0 &&
        users.map((user) => {
          if (user.videoTrack) {
            return (
              <div className={`p-2 ${gridSpacing}`} key={user.uid}>
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  className="w-full h-full rounded-lg overflow-hidden"
                />
              </div>
            );
          } else return null;
        })}
    </div>
  );
}
