import { useEffect, useState } from "react";
import ChannelMenu from "../components/ChannelMenu";
import ChatArea from "../components/ChatArea";
import ChatRightArea from "../components/ChatRightArea";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import VideoConferenceRoom from "../components/VideoConferenceRoom";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";

interface SingleChannel {
  _id: string;
  channelName: string;
}

const Channel = () => {
  const { user, token, socket, setSingleChannel, connectedToVoice } =
    useUserContext();

  const serverUrl = "wss://discord-clone-6tnm5nqn.livekit.cloud";

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

    socket.on("userLeftVoiceRoom", (data) => {
      const { _id, roomName } = data;
      setSingleChannel((prev) => {
        if (!prev) {
          return prev;
        }
        const updatedChannel = prev.voiceChannel.map((channel) => {
          if (channel.voiceRoomName === roomName) {
            const updatedVoiceChannel = channel.voiceUsers.filter(
              (item) => item._id !== _id
            );
            return {
              ...channel,
              voiceUsers: updatedVoiceChannel,
            };
          }
          return channel;
        });

        return {
          ...prev,
          voiceChannel: updatedChannel,
        };
      });
    });

    socket.on("sendUserChangedRoom", (data) => {
      const { _id, roomName } = data;
    
      setSingleChannel((prev) => {
        if (!prev) {
          return prev;
        }

        const updatedChannel = prev.voiceChannel.map((voiceRoom) => {
          if (voiceRoom.voiceRoomName === roomName) {
            const updatedVoiceChannel = voiceRoom.voiceUsers.filter(
              (item) => item._id !== _id 
            );

            return {
              ...voiceRoom,
              voiceUsers: updatedVoiceChannel, 
            };
          }
          return voiceRoom;
        });

        return {
          ...prev,
          voiceChannel: updatedChannel, 
        };
      });
    });

    return () => {
      if (socket) {
        socket.off("userJoinedVoiceRoom");
        socket.off("userLeftVoiceRoom");
        socket.off("sendUserChangedRoom");
      }
    };
  }, [socket, user]);

  return (
    <div className="w-full flex bg-[#313338]">
      <LiveKitRoom
        video={true}
        audio={true}
        connect={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <RoomAudioRenderer />
        <ChannelMenu />
      </LiveKitRoom>

      {/* {
          connectedToVoice ? <div className="w-[70%]">
            <VideoConferenceRoom />
          </div>:
         
         } */}
      <ChatArea />

      <ChatRightArea />
    </div>
  );
};

export default Channel;
