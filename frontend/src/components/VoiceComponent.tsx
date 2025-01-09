import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { PiMicrophoneSlashFill } from "react-icons/pi";
import { FaHeadphones, FaMicrophone, FaSignOutAlt } from "react-icons/fa";
import { TbHeadphonesOff } from "react-icons/tb";
import axios from "axios";

interface UserProps {
  item: {
    username: string;
    profilePic: string;
    _id: string;
  };
  roomName: string;
}

const VoiceComponent = ({ item, roomName }: UserProps) => {
  const { user, singleChannel, socket, setSingleChannel } = useUserContext();

  const [userAudioStates, setUserAudioStates] = useState<{
    [userId: string]: { micOff: boolean; headphonesOff: boolean };
  }>({});

  // const currentUserState = userAudioStates[item._id] || {
  //   micOff: false,
  //   headphonesOff: false,
  // };

  // const toggleMic = (userId: string) => {
  //   setUserAudioStates((prev) => ({
  //     ...prev,
  //     [userId]: {
  //       ...prev[userId],
  //       micOff: !prev[userId]?.micOff,
  //     },
  //   }));
  // };

  // const toggleHeadphones = (userId: string) => {
  //   setUserAudioStates((prev) => ({
  //     ...prev,
  //     [userId]: {
  //       ...prev[userId],
  //       headphonesOff: !prev[userId]?.headphonesOff,
  //     },
  //   }));
  // };

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
      }
    } catch (error) {
      console.error("Error disconnecting from voice channel:", error);
    }
  };

  return (
    <div className="w-full flex flex-col mt-3 space-y-3">
      <div className="flex items-center gap-3 bg-[#313338] p-2 rounded-lg shadow-md">
        <div className="w-full flex items-center gap-2">
          <img
            className="w-8 h-8 rounded-full"
            src={`http://localhost:5000${item.profilePic}`}
            alt={`${item.username}'s profile`}
          />
          <p className="text-white font-medium">{item.username}</p>
        </div>

        <div className="flex gap-2 items-center">
 
          {item._id === user?.userId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDisconnectFromVoice();
              }}
              className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition duration-200"
              title="Disconnect from Voice Channel"
            >
              <FaSignOutAlt className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceComponent;
