import { MdSettingsVoice } from "react-icons/md";
import { useUserContext } from "../context/UserContext";

import axios from "axios";
import { useEffect, useState } from "react";
import VoiceComponent from "./VoiceComponent";

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
};

const ChannelVoiceItem = ({
  item,
}: ChannelVoiceItemProps) => {
  const { user, socket, singleChannel } = useUserContext();

  const handleConnectToVoice = async () => {
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
        socket.emit("joinVoiceRoom", {
          serverName: singleChannel?.channelName,
          roomName: item.voiceRoomName,
          userId: user?.userId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div
  onClick={() => handleConnectToVoice()}
  className="w-full h-auto text-gray-400 flex flex-col items-start gap-2 px-7 py-3 rounded-lg hover:text-white hover:bg-gray-700 cursor-pointer transition-all"
>
  <div className="w-full flex items-center gap-4">
    <MdSettingsVoice className="text-2xl" />
    <p className="font-semibold text-lg">{item.voiceRoomName}</p>
  </div>


  {singleChannel?.voiceChannel
    ?.filter((channel) => channel.voiceRoomName === item.voiceRoomName) 
    .map((channel, index) => (
      <div key={index}>
        {channel.voiceUsers?.map((user, userIndex) => (
          <VoiceComponent key={userIndex} item={user} roomName={item.voiceRoomName}  />
        ))}
      </div>
    ))}
</div>

  );
};

export default ChannelVoiceItem;
