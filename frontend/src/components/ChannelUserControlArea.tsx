import axios from "axios";
import { ImConnection } from "react-icons/im";
import { PiPhoneDisconnectFill } from "react-icons/pi";
import { useUserContext } from "../context/UserContext";
import { useRoomContext } from "@livekit/components-react";
import { useEffect } from "react";

const ChannelUserControlArea = () => {

    const {user,singleChannel,setSingleChannel,socket,setHandleDisconnect,handleDisconnect,voiceRoomName,connectedToVoice,setConnectedToVoice} = useUserContext();
    const room = useRoomContext();


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



  return (
    <div className="w-full h-20 bg-[#1E1F22]">
        <div className="flex justify-between p-2 items-center">
            <div>
            <div className="flex text-green-500 items-center gap-2">
            <ImConnection className="text-xl" />
            <p>Voice Connected</p>
            </div>
            <p className="text-[#9C9A8E] px-1 text-sm">Voice Room 1</p>
            </div>
            <div className="pr-2 text-2xl text-red-600 cursor-pointer">
                <PiPhoneDisconnectFill onClick={()=>handleDisconnectFromVoice()}  />
            </div>

        </div>
    </div>
  )
}

export default ChannelUserControlArea
