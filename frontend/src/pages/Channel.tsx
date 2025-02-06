import { useEffect, useState } from "react";
import ChannelMenu from "../components/ChannelMenu";
import ChatArea from "../components/ChatArea";
import ChatRightArea from "../components/ChatRightArea";
import { useUserContext } from "../context/UserContext";
import {
  GridLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import { useNavigate, useParams } from "react-router-dom";
import { Track } from "livekit-client";
import "@livekit/components-styles";

interface ChannelUser {
  _id: string;
  username: string;
  profilePic: string;
}

interface ChannelProps {
  isAreaOpen:boolean;
  setIsAreaOpen:(isAreaOpen:boolean)=>void;
}


type VoiceUser = {
  _id: string;
  username: string;
  profilePic: string;
};

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
interface ChatChannel {
  roomName: string;
  messages: string[];
}

const Channel = ({isAreaOpen,setIsAreaOpen}:ChannelProps) => {
  const {
    user,
    socket,
    setSingleChannel,
    singleChannel,
    allUser,
    setAllUser,
    isCameraOn,
    setIsCameraOn,
    connectedToVoice,
    activeRoom,
    setActiveRoom,
    setChannels,
    setActiveChannel,
    setConnectedToVoice,
  } = useUserContext();

  const { channelId } = useParams();

  const [onlineChannelUsers, setOnlineChannelUsers] = useState<ChannelUser[]>(
    []
  );

  const navigate = useNavigate();

  useEffect(() => {
    socket.on("userJoinedVoiceRoom", (data) => {
      const { username, profilePic, _id, channelId,roomName } = data;
      if(channelId === singleChannel?._id){
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
      }
     
    });

    socket.on("userLeftVoiceRoom", (data) => {
      const { channelId,roomName,_id } = data;
      if(channelId === singleChannel?._id){
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
      }
    });

    socket.on("sendUserChangedRoom", (data) => {
      const {channelId, _id, roomName } = data;

      if(channelId === singleChannel?._id){
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
      }
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


    socket.on("kickedFromChannel", (data) => {
      const {channelId} =data;

      if(channelId === singleChannel?._id){
        setChannels((prev) => {
          if (!prev) {
            return prev;
          }
          const filteredChannel = prev.filter((data) => data._id !== channelId);
          return filteredChannel;
        });
        setActiveChannel("");
        setActiveRoom("");
        setConnectedToVoice(false);
        setActiveRoom("");
        navigate("/home");
      }
    });

    socket.on("userJoinedChannel", (data) => {
      console.log("userjoinedchannel work on channel");
      
      const {channelId,userData} = data;   
      if(singleChannel?._id === channelId){
        setOnlineChannelUsers((prev) => {
          if (!prev){
            return prev;
          } 
          if (prev.some(user => user._id === userData._id)) return prev;
          return [...prev, userData];
        });
        setSingleChannel((prev:any)=>{
          if(!prev){
            return prev;
          }
          return {
            ...prev,
            channelUsers: [...prev.channelUsers, userData], 
          };
        })
       
      }
    });

    socket.on("userLeftChannel",(data)=>{ 
      const {userId,channelId} = data;  
      if(channelId === singleChannel?._id){
        setSingleChannel((prev)=>{
          if(!prev){
            return prev;
          }
          const filteredUser = prev.channelUsers.filter((item)=>item._id !==userId);
          return {
            ...prev,channelUsers:filteredUser
          }
        })
      }
    })
    socket.on("chatChannelInfo",(data)=>{
      const {channelId,chatRoom} = data;
      if(singleChannel?._id === channelId){
        setSingleChannel((prev: SingleChannel | null) => {
              if (!prev) {
                return prev;
              }
              const fixedChatRoom = {
                ...chatRoom,
                roomName: chatRoom,
              };
              return {
                ...prev,
                chatChannel: [...prev.chatChannel, fixedChatRoom],
              };
            });
          }
    })
    socket.on("chatVoiceInfo",(data)=>{
      const {channelId,voiceRoomName} = data;
      if(singleChannel?._id === channelId){
        setSingleChannel((prev: SingleChannel | null) => {
              if (!prev) {
                return prev;
              }
              return {
                ...prev,
                voiceChannel: [...prev.voiceChannel, voiceRoomName],
              };
            });
      }
    })

    return () => {
      if (socket) {
        socket.off("userJoinedVoiceRoom");
        socket.off("userLeftVoiceRoom");
        socket.off("sendUserChangedRoom");
        socket.off("onlineChannelUsers");
        socket.off("onlineAllChannelUsers");
        // socket.off("userThatDisconnected");
        socket.off("chatVoiceInfo");
        socket.off("chatChannelInfo");
        socket.off("kickedFromChannel");
        socket.off("userJoinedChannel");
        socket.off("userLeftChannel");
      }
    };
  }, [socket, user, singleChannel, onlineChannelUsers,allUser]);

  useEffect(() => {
  console.log("allUser",allUser);
  
    socket.emit("sendChannelUsers", { allUser, senderId: user?.userId });
  
  }, [singleChannel]);
  function MyVideoConference() {
    // `useTracks` returns all camera and screen share tracks. If a user
    // joins without a published camera track, a placeholder track is returned.
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
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
    <div className="w-full flex  bg-[#313338] justify-center md:justify-between " key={channelId}>
      <ChannelMenu
        setIsCameraOn={setIsCameraOn}
        isCameraOn={isCameraOn}
        setActiveRoom={setActiveRoom}
        activeRoom={activeRoom}
        isAreaOpen={isAreaOpen}
        setIsAreaOpen={setIsAreaOpen}
      />

      {/* {
          connectedToVoice ? <div className="w-[70%]">
            <VideoConferenceRoom />
          </div>:
         
         } */}

      {connectedToVoice && activeRoom === "video" ? (
        <div className={`w-[70%]`}>
          <MyVideoConference />
        </div>
      ) : activeRoom === "chat" || activeRoom === "" ? (
        <ChatArea />
      ) : null}

      <ChatRightArea onlineChannelUsers={onlineChannelUsers} />
    </div>
  );
};

export default Channel;
