import axios from "axios";
import { ImConnection } from "react-icons/im";
import { PiPhoneDisconnectFill } from "react-icons/pi";
import { useUserContext } from "../context/UserContext";
import { useRoomContext } from "@livekit/components-react";
import { BsCameraVideoFill } from "react-icons/bs";
import { MdScreenShare } from "react-icons/md";
import { useEffect, useState } from "react";
import { LocalVideoTrack } from "livekit-client";

interface ChannelProps {
  setIsCameraOn:(isCameraOn:boolean)=>void;
  isCameraOn:boolean;
}

const ChannelUserControlArea = ({isCameraOn,setIsCameraOn}:ChannelProps) => {
  const {
    user,
    singleChannel,
    setSingleChannel,
    socket,
    setHandleDisconnect,
    handleDisconnect,
    voiceRoomName,
    connectedToVoice,
    setConnectedToVoice,
    setSelectedChatRoom,
    setActiveRoom
  } = useUserContext();
  const room = useRoomContext();

  const [connectionState, setConnectionState] = useState(room.state); 

  const handleDisconnectFromVoice = async () => {
    setActiveRoom("chat");
    console.log(room);

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
        setConnectedToVoice(false);

        console.log("User disconnected and removed from voice channel");

        setSingleChannel((prev) => {
          if (!prev) return prev;

          const updatedVoiceChannels = prev.voiceChannel.map((channel) => {
            if (channel.voiceRoomName === voiceRoomName) {
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
          voiceRoomName,
          userId: user?.userId,
        });

        socket.emit("sendVoiceLeftUser", {
          serverName: singleChannel?.channelName,
          roomName: voiceRoomName,
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
    const handleStateChange = () => {
      setConnectionState(room.state);
    };

    room.on("connected", handleStateChange);
    room.on("disconnected", handleStateChange);
    room.on("reconnecting", handleStateChange);
    room.on("reconnected", handleStateChange);

    return () => {
      room.off("connected", handleStateChange);
      room.off("disconnected", handleStateChange);
      room.off("reconnecting", handleStateChange);
      room.off("reconnected", handleStateChange);
    };
  }, [room]);

  const handleCameraToggle = () => {
    // const userIdCameraToSend: string[] = [];
    // singleChannel?.voiceChannel.map((item)=>{
    //   if(item.voiceRoomName===voiceRoomName){
    //      item.voiceUsers.map((item)=>{
    //       if(item._id !==user?.userId){
    //         userIdCameraToSend.push(item._id)
    //       }
    //     })
    //   }
    // })
    
    const state = !isCameraOn;
    setIsCameraOn(state);
    room.localParticipant.setCameraEnabled(state)
    // socket.emit("toggleCamera",({userIdCameraToSend,senderId:user?.userId,isCameraOn:state}))
 
  };

  return (
    <div className="w-full h-24 bg-[#232428]">
      <div className="flex justify-between p-2 items-center">
        <div>
          <div className="flex text-green-500 items-center gap-2">
            <ImConnection className="text-xl" />
            {connectionState === "connected" && (
              <p className="text-green-500">Voice Connected</p>
            )}
            {connectionState === "connecting" && (
              <p className="text-orange-500">Connecting...</p>
            )}
            {connectionState === "disconnected" && (
              <p className="text-red-500">Disconnected</p>
            )}
            {connectionState === "reconnecting" && (
              <p className="text-blue-500">Connecting...</p>
            )}
          </div>
          <p className="text-[#9C9A8E] px-1 text-sm">{voiceRoomName}</p>
        </div>
        <div className="pr-2 text-2xl text-red-600 cursor-pointer">
          <PiPhoneDisconnectFill onClick={() => {
            handleDisconnectFromVoice();
            setIsCameraOn(false)
          }} />
        </div>
      </div>
      <div className="w-full h-full">
        <div className="flex text-gray-400 px-2 gap-3 ">
          <div onClick={()=>handleCameraToggle()} className="w-10 h-8 bg-[#2B2D31] cursor-pointer rounded-md text-xl flex items-center justify-center">
            <BsCameraVideoFill />
          </div>

          <div className="w-10 h-8 bg-[#2B2D31] cursor-pointer rounded-md text-xl flex items-center justify-center">
            <MdScreenShare />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelUserControlArea;
