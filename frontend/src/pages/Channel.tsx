import { useEffect, useState } from "react";
import ChannelMenu from "../components/ChannelMenu";
import ChatArea from "../components/ChatArea";
import ChatRightArea from "../components/ChatRightArea";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

interface SingleChannel {
  _id: string;
  channelName: string;
}

const Channel = () => {
  const { user, socket, setSingleChannel } = useUserContext();

  useEffect(() => {
    socket.on("userJoinedVoiceRoom", (data) => {
      const { username, profilePic, _id, roomName } = data;
      
      console.log(data);
      
      setSingleChannel((prev) => {
        if (!prev) {
          return prev;
        }
        const updatedVoiceChannels = prev.voiceChannel.map((channel) => {
          if (channel.voiceRoomName === roomName) {
            return {
              ...channel,
              voiceUsers: [
                ...channel.voiceUsers,
                { username, profilePic, _id },
              ],
            };
          }
          return channel;
        });

        return {
          ...prev,
          voiceChannel: updatedVoiceChannels,
        };
      });
    });

    return () => {
      if(socket){
        socket.off("userJoinedVoiceRoom");
      }
    };
  }, [socket,user]);

  return (
    <div className="w-full flex bg-[#313338]">
      <ChannelMenu />
      <ChatArea />
      <ChatRightArea />
    </div>
  );
};

export default Channel;
