import { MdSettingsVoice } from "react-icons/md";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { useUserContext } from "../context/UserContext";

import axios from "axios";
import { useEffect, useState } from "react";
import VoiceComponent from "./VoiceComponent";
import VideoConferenceRoom from "./VideoConferenceRoom";
import { useRoomContext } from "@livekit/components-react";

type VoiceUser = {
  _id: string;
  username: string;
  profilePic: string;
};


type ChannelVoiceItemProps = {
  item: {
    voiceRoomName: string;
    voiceUsers: VoiceUser[];
    _id: string;
  };
  activeRoom:string;
  setActiveRoom:(activeRoom:string)=>void;
};


interface ChatChannel {
  roomName: string;
  messages: string[];
}



interface VoiceChannel {
  voiceRoomName: string;
  voiceUsers: VoiceUser[];  
  _id: string;
}

interface VoiceChannel {
  voiceRoomName: string;
  voiceUsers: VoiceUser[];
  _id: string;
}

interface SingleChannel {
  _id: string;
  channelName: string;
  chatChannel: ChatChannel[];
  voiceChannel: VoiceChannel[];
  admin: string[];
  channelUsers: VoiceUser[];
  channelPic: string;
}

const ChannelVoiceItem = ({
  item,activeRoom,setActiveRoom
}: ChannelVoiceItemProps) => {
  const { user, socket, singleChannel,setSingleChannel,voiceRoomName,setConnectedToVoice,setToken ,setVoiceRoomName,connectedToVoice,setHandleDisconnect,setWhichChannelConnected} = useUserContext();

  const room = useRoomContext();

  const handleConnectToVoice = async () => {
    setActiveRoom("video");
    setVoiceRoomName(item.voiceRoomName);
    const currentVoiceRoomName = singleChannel?.voiceChannel.find((channel) =>
      channel.voiceUsers.some((voiceUser) => voiceUser._id === user?.userId)
    )?.voiceRoomName;

    if (connectedToVoice && currentVoiceRoomName && currentVoiceRoomName !== item.voiceRoomName) {
      room.disconnect();
      setConnectedToVoice(false);
      socket.emit("userChangedRoom",{
        serverName: singleChannel?.channelName,
          roomName: voiceRoomName,
          _id: user?.userId,
      })
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/channel/addusertovoicechannel",
        {
          userId: user?.userId,
          channelId: singleChannel?._id,
          voiceRoomName: item.voiceRoomName,
        }
      );
  
      if (response.status === 200) {
        setWhichChannelConnected(singleChannel?.channelName ?? "");
        localStorage.setItem("whichChannelConnected",singleChannel?._id || "")
        localStorage.setItem("userId",user?.userId || "");
        setSingleChannel((prev: SingleChannel | null) => {
          if (!prev) return prev;
  
          const updatedVoiceChannels = prev.voiceChannel.map((channel) => {
            const updatedVoiceUsers = channel.voiceUsers.filter(
              (voiceUser) => voiceUser._id !== user?.userId
            );
  
            if (channel.voiceRoomName === item.voiceRoomName) {
              return {
                ...channel,
                voiceUsers: [...updatedVoiceUsers, response.data],
              };
            }
  
            return {
              ...channel,
              voiceUsers: updatedVoiceUsers,
            };
          });
  
          return {
            ...prev,
            voiceChannel: updatedVoiceChannels,
          };
        });

        socket.emit("joinVoiceRoom", {
          serverName: singleChannel?.channelName,
          roomName: item.voiceRoomName,
          userId: user?.userId,
        });
        socket.emit("sendVoiceJoinedUser", {
          serverName: singleChannel?.channelName,
          roomName: item.voiceRoomName,
          username: user?.username,
          profilePic: user?.profilePic,
          _id: user?.userId,
        });

        try {
          const channelAndVoiceRoomName = `${singleChannel?.channelName}-${item.voiceRoomName}`;
          const response = await axios.get("http://localhost:5000/getToken", {
            params: {
              roomName: channelAndVoiceRoomName,
              username: user?.username,
            },
          });
          setToken(response.data.token);
          setConnectedToVoice(true);
        } catch (error) {
          console.error("Error getting token:", error);
        }
      }
    } catch (error) {
      console.error("Error connecting to voice channel:", error);
    }
  };
  



  return (
    <div
  onClick={() => handleConnectToVoice()}
  className="w-full h-auto text-gray-400 flex flex-col items-start gap-2 px-7 py-1 rounded-lg hover:text-white hover:bg-gray-700 cursor-pointer transition-all"
>
  <div className="w-full flex items-center gap-4">
    <HiMiniSpeakerWave className="text-sm md:text-2xl" />
    <p className="font-semibold text-sm md:text-md">{item.voiceRoomName}</p>
    <p className="text-xs md:text-base">{item.voiceUsers.length}/10</p>
  </div>
  
  {singleChannel?.voiceChannel
    ?.filter((channel) => channel.voiceRoomName === item.voiceRoomName) 
    .map((channel, index) => (
      <div key={index} className="flex flex-col gap-3 w-full">
        {channel.voiceUsers?.map((user, userIndex) => (
          <VoiceComponent key={userIndex} item={user} roomName={item.voiceRoomName}  />
        ))}
      </div>
    ))}
</div>

  );
};

export default ChannelVoiceItem;
