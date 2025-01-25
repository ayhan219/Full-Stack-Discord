import { useEffect, useState } from "react";
import ChannelMenu from "../components/ChannelMenu";
import ChatArea from "../components/ChatArea";
import ChatRightArea from "../components/ChatRightArea";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import VideoConferenceRoom from "../components/VideoConferenceRoom";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { useParams } from "react-router-dom";

interface ChannelUser {
  _id: string;
  username: string;
  profilePic: string;
}

const Channel = () => {
  const {
    user,
    token,
    socket,
    setSingleChannel,
    singleChannel,
    allUser,
    setAllUser,
    activeChannel,getSingleChannel
  } = useUserContext();

  const {channelId} = useParams();


  const [onlineChannelUsers, setOnlineChannelUsers] = useState<ChannelUser[]>(
    []
  );


 
  

  useEffect(() => {
    socket.on("userJoinedVoiceRoom", (data) => {
      const { username, profilePic, _id, roomName } = data;

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

    socket.on("onlineChannelUsers", (senderId) => {
      setOnlineChannelUsers((prev) => {
        if (
          !prev.some((user) => user._id === senderId._id) &&
          singleChannel?.channelUsers.some((user:any) => user._id === senderId._id)
        ) {
          return [...prev, senderId];
        }
        return prev;
      });
    });

    socket.on("onlineAllChannelUsers", (onlineChannelUserFromSocket) => {
      const filteredUsers = onlineChannelUserFromSocket.filter((user: any) =>
        singleChannel?.channelUsers.some((item: any) => item._id === user._id)
      );
      setOnlineChannelUsers(filteredUsers);
    });

    socket.on("userThatDisconnected", (senderId) => {
      setOnlineChannelUsers((prev) => {
        if (!prev) {
          return prev;
        }
        const newData = prev.filter((user) => user._id !== senderId);

        return newData;
      });
    });

    return () => {
      if (socket) {
        socket.off("userJoinedVoiceRoom");
        socket.off("userLeftVoiceRoom");
        socket.off("sendUserChangedRoom");
        socket.off("onlineChannelUsers");
        socket.off("onlineAllChannelUsers");
        socket.off("userThatDisconnected");
      }
    };
  }, [socket, user,singleChannel]);

  useEffect(() => {
    socket.emit("sendChannelUsers", { allUser, senderId: user?.userId });
  }, [singleChannel]);

 

  return (
    <div className="w-full flex bg-[#313338]" key={channelId}>
      <ChannelMenu />

      {/* {
          connectedToVoice ? <div className="w-[70%]">
            <VideoConferenceRoom />
          </div>:
         
         } */}
      <ChatArea />

      <ChatRightArea onlineChannelUsers={onlineChannelUsers} />
    </div>
  );
};

export default Channel;
