import { useUserContext } from '../context/UserContext';
import { PiMicrophoneSlashFill } from "react-icons/pi";
import { FaHeadphones, FaMicrophone, FaSignOutAlt } from "react-icons/fa";
import { TbHeadphonesOff } from "react-icons/tb";
import axios from 'axios';

interface UserProps {
  item:{
    username:string,
    profilePic:string,
    _id:string
  }
  roomName: string;
}


interface VoiceChannel {
    voiceRoomName: string;
    voiceUsers: VoiceUser[];  
    _id: string;
  }

  type VoiceUser = {
    _id: string;
    username: string;
    profilePic: string;
  };
  

  
interface ChatChannel {
    roomName: string;
    messages: string[];
  }
  
  
  interface SingleChannel {
    _id: string;
    channelName: string;
    chatChannel: ChatChannel[];
    voiceChannel: VoiceChannel[];
    admin:string[],
    channelUsers: [];
  }

const VoiceComponent = ({ item, roomName }: UserProps) => {
  const {
    turnMicOff,
    user,
    setTurnMicOff,
    turnHeadOff,
    setTurnHeadOff,
    singleChannel,
    socket,
    setSingleChannel
  } = useUserContext();

  const handleDisconnectFromVoice = async () => {
    try {
      const response = await axios.delete("http://localhost:5000/api/channel/deleteuserfromvoicechannel", {
        data: {
          userId: user?.userId,
          channelId: singleChannel?._id,
        }
      });
      if (response.status === 200) {
        console.log("User disconnected and removed from voice channel");
  
        setSingleChannel((prev: SingleChannel | null) => {
          if (!prev) return prev;
  

          const updatedVoiceChannels = prev.voiceChannel.map((channel) => {
            if (channel.voiceRoomName === roomName) {
              return {
                ...channel,
                voiceUsers: channel.voiceUsers.filter((user) => user._id !== response.data._id), 
              };
            }
            return channel;
          });
  
          return {
            ...prev,
            voiceChannel: updatedVoiceChannels, 
          };
        });
  
        socket.emit("leaveVoiceRoom", {
          serverName: singleChannel?.channelName,
          roomName: roomName,
          userId: user?.userId,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col mt-3 space-y-3">
      <div className="flex items-center gap-3 bg-[#313338] p-2 rounded-lg shadow-md">
        <div className="w-full h-full flex gap-2">
          <img
            className="w-6 h-6 rounded-full"
            src={`http://localhost:5000${item.profilePic}`}
            alt=""
          />
          <p>{item.username}</p>
        </div>

        <div>
          <div className="flex text-white text-base gap-2 items-center">
            {/* Toggle microphone */}
            <div
              onClick={() => setTurnMicOff(!turnMicOff)}
              className={`cursor-pointer transition duration-200 ${turnMicOff ? "text-red-600" : ""}`}
            >
              {turnMicOff ? <PiMicrophoneSlashFill /> : <FaMicrophone />}
            </div>

            {/* Toggle headphones */}
            <div
              onClick={() => setTurnHeadOff(!turnHeadOff)}
              className={`cursor-pointer transition duration-200 ${turnHeadOff ? "text-red-600" : ""}`}
            >
              {turnHeadOff ? <TbHeadphonesOff /> : <FaHeadphones />}
            </div>

            {item._id === user?.userId && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleDisconnectFromVoice();
                }}
                className="cursor-pointer text-red-600 transition duration-200"
              >
                <FaSignOutAlt />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceComponent;
