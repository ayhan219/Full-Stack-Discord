import { useEffect, useState } from "react";
import ChannelMenu from "../components/ChannelMenu";
import ChatArea from "../components/ChatArea";
import ChatRightArea from "../components/ChatRightArea";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import VideoConferenceRoom from "../components/VideoConferenceRoom";
import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import { useParams } from "react-router-dom";
import { Track } from "livekit-client";
import "@livekit/components-styles";

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
    activeChannel,
    getSingleChannel,
    isCameraOn,
    setIsCameraOn,
    connectedToVoice,
    selectedChatRoom,
    setSelectedChatRoom,
    activeRoom,
    setActiveRoom
  } = useUserContext();

  const { channelId } = useParams();

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
          singleChannel?.channelUsers.some(
            (user: any) => user._id === senderId._id
          )
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

    socket.on("cameraToggled", ({ senderId, isCameraOn }) => {
      console.log(`${senderId} is opened camera?`, isCameraOn);
    });

    return () => {
      if (socket) {
        socket.off("userJoinedVoiceRoom");
        socket.off("userLeftVoiceRoom");
        socket.off("sendUserChangedRoom");
        socket.off("onlineChannelUsers");
        socket.off("onlineAllChannelUsers");
        // socket.off("userThatDisconnected");
        socket.off("cameraToggled");
      }
    };
  }, [socket, user, singleChannel,onlineChannelUsers]);

  useEffect(() => {
    socket.emit("sendChannelUsers", { allUser, senderId: user?.userId });
  }, [singleChannel]);
  

  function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        // { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false }
    );

    return (
      <GridLayout
        tracks={tracks}
        style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}
      >
        {/* The GridLayout accepts zero or one child. The child is used
        as a template to render all passed in tracks. */}
        <ParticipantTile />
      </GridLayout>
    );
  }

  return (
    <div className="w-full flex bg-[#313338]" key={channelId}>
      <ChannelMenu setIsCameraOn={setIsCameraOn} isCameraOn={isCameraOn} setActiveRoom={setActiveRoom} activeRoom={activeRoom} />

      {/* {
          connectedToVoice ? <div className="w-[70%]">
            <VideoConferenceRoom />
          </div>:
         
         } */}

      {connectedToVoice && activeRoom==="video"   ? (
        <div className={`w-[70%]`}>
          <MyVideoConference />
          
        </div>
      ) :
      activeRoom === 'chat' || activeRoom ==='' ? (
        <ChatArea />
      ) : null}
      
      <ChatRightArea onlineChannelUsers={onlineChannelUsers}  />
    </div>
  );
};

export default Channel;
