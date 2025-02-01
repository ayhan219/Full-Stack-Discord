import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { FaHeadphones, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { TbHeadphonesOff } from "react-icons/tb";
import { useUserContext } from "../context/UserContext";

interface UserProps {
  item: {
    username: string;
    profilePic: string;
    _id: string;
  };
  roomName: string;
}

const VoiceComponent = ({ item, roomName }: UserProps) => {
  const room = useRoomContext();
  const { turnHeadOff, turnMicOff, user } = useUserContext(); 
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const handleActiveSpeakerChange = () => {
      const activeSpeakers = room?.activeSpeakers || [];
      const isCurrentUserSpeaking = activeSpeakers.some(
        (participant) => participant.identity === item.username
      );
      setIsSpeaking(isCurrentUserSpeaking);
    };

    room?.on("activeSpeakersChanged", handleActiveSpeakerChange);
    return () => {
      room?.off("activeSpeakersChanged", handleActiveSpeakerChange);
    };
  }, [room, item.username]);

  const isCurrentUser = item._id === user?.userId; 

  return (
    <div className="w-full flex flex-col space-y-2">
      <div className="flex items-center px-2 gap-4 rounded-lg transition-colors duration-300">
        <div className="flex items-center gap-1 md:gap-3 w-full justify-between">
          <img
            className={`w-5 h-5 md:w-7 md:h-7 rounded-full border-2 ${
              isSpeaking ? "border-green-500 border-2" : "border-blue-500"
            }`}
            src={`http://localhost:5000${item.profilePic}`}
            alt={`${item.username}'s profile`}
          />
          <div className="flex w-full justify-between px-0 md:px-1">
            <p className="text-white font-semibold text-xs md:text-sm">{item.username}</p>
            {isCurrentUser && (
              <div className="flex gap-1 md:gap-2 items-center text-xs md:text-sm">
                {!turnMicOff ? (
                  <FaMicrophone />
                ) : (
                  <FaMicrophoneSlash className="text-red-600" />
                )}
                {!turnHeadOff ? (
                  <FaHeadphones />
                ) : (
                  <TbHeadphonesOff className="text-red-600" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceComponent;
