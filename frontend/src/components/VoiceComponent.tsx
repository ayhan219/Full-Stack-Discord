import { useEffect, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";
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
  const {
    user,
    singleChannel,
    socket,
    setSingleChannel,
    handleDisconnect,
    setHandleDisconnect,
  } = useUserContext();

  const room = useRoomContext();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleDisconnectFromVoice = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/channel/deleteuserfromvoicechannel",
        {
          data: {
            userId: user?.userId,
            channelId: singleChannel?._id,
          },
        }
      );

      if (response.status === 200) {
        room.disconnect();

        console.log("User disconnected and removed from voice channel");

        setSingleChannel((prev) => {
          if (!prev) return prev;

          const updatedVoiceChannels = prev.voiceChannel.map((channel) => {
            if (channel.voiceRoomName === roomName) {
              return {
                ...channel,
                voiceUsers: channel.voiceUsers.filter(
                  (voiceUser) => voiceUser._id !== user?.userId
                ),
              };
            }
            return channel;
          });

          return { ...prev, voiceChannel: updatedVoiceChannels };
        });

        socket.emit("leaveVoiceRoom", {
          serverName: singleChannel?.channelName,
          roomName,
          userId: user?.userId,
        });

        socket.emit("sendVoiceLeftUser", {
          serverName: singleChannel?.channelName,
          roomName: roomName,
          username: user?.username,
          profilePic: user?.profilePic,
          _id: user?.userId,
        });
        setHandleDisconnect(false);
      }
    } catch (error) {
      console.error("Error disconnecting from voice channel:", error);
    }
  };

  useEffect(() => {
    if (handleDisconnect) {
      handleDisconnectFromVoice();
    }
  }, [handleDisconnect]);

  useEffect(() => {
    const handleActiveSpeakerChange = () => {
      const activeSpeakers = room?.activeSpeakers || [];
      console.log(activeSpeakers);
      
      const isCurrentUserSpeaking = activeSpeakers.some(
        (participant) => participant.identity === item.username
      );
      setIsSpeaking(isCurrentUserSpeaking);
      
    };

    room?.on("activeSpeakersChanged", handleActiveSpeakerChange);
    return () => {
      room?.off("activeSpeakersChanged", handleActiveSpeakerChange);
    };
  }, [room, item._id]);

  return (
    <div className="w-full flex flex-col mt-4 space-y-4">
      <div className="flex items-center px-4 gap-4 rounded-lg transition-colors duration-300">
        <div className="flex items-center gap-3">
          <img
            className={`w-8 h-8 rounded-full border-2 ${
              isSpeaking ? "border-green-500 border-2" : "border-blue-500"
            }`}
            src={`http://localhost:5000${item.profilePic}`}
            alt={`${item.username}'s profile`}
          />
          <p className="text-white font-semibold text-lg">{item.username}</p>
        </div>

        {item._id === user?.userId && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDisconnectFromVoice();
            }}
            className="flex items-center gap-2 bg-red-600 text-white p-1 rounded-md cursor-pointer hover:bg-red-500 transition-colors duration-300"
          >
            <FiLogOut className="text-xl" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceComponent;
