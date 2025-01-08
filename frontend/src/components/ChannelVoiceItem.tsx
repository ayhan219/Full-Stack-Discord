import { MdSettingsVoice } from "react-icons/md";
import { useUserContext } from "../context/UserContext";
import { PiMicrophoneSlashFill } from "react-icons/pi";
import { FaHeadphones, FaMicrophone, FaSignOutAlt } from "react-icons/fa";
import { TbHeadphonesOff } from "react-icons/tb";
import axios from "axios";
import { useEffect, useState } from "react";

type ChannelVoiceItemProps = {
  item: {
    voiceRoomName: string;
    voiceUsers: string[];
    _id: string;
  };
  connectToVoice: boolean;
  setConnectToVoice: (connectToVoice: boolean) => void;
};

const ChannelVoiceItem = ({
  item,
  setConnectToVoice,
  connectToVoice,
}: ChannelVoiceItemProps) => {
  const { user,socket, turnMicOff, setTurnMicOff, turnHeadOff, setTurnHeadOff,singleChannel } =
    useUserContext();

    const [voiceUsers, setVoiceUsers] = useState([]);

    useEffect(() => {
      socket.on("voiceRoomUsers", (users) => {
        setVoiceUsers(users);
      });
  
      return () => {
        socket.off("voiceRoomUsers");
      };
    }, []);

    const handleConnectToVoice = () => {
      setConnectToVoice(true);
      socket.emit("joinVoiceRoom", {
        serverName:singleChannel?.channelName,
        roomName: item.voiceRoomName,
        userId:user?.userId
      });
    };

    const handleDisconnect = () => {
      setConnectToVoice(false);
      socket.emit("leaveVoiceRoom", {
        serverName:singleChannel?.channelName,
        roomName: item.voiceRoomName,
        userId:user?.userId
      });
    };

    // const handleConnectToVoice = async()=>{
    //   try {
    //     const response = await axios.post("http://localhost:5000/api/channel/addusertovoicechannel",{
    //       userId:user?.userId,
    //       channelId:singleChannel?._id,
    //       voiceRoomName:item.voiceRoomName

    //     })
    //     if(response.status ===200){
    //       setConnectToVoice(true)
    //     }
        
    //   } catch (error) {
    //     console.log(error);
    //   }
    //   setConnectToVoice(true)
    // }
  return (
    <div
      onClick={() => handleConnectToVoice()}
      className="w-full h-auto text-gray-400 flex flex-col items-start gap-2 px-7 py-3 rounded-lg hover:text-white hover:bg-gray-700 cursor-pointer transition-all"
    >
      <div className="w-full flex items-center gap-4">
        <MdSettingsVoice className="text-2xl" />
        <p className="font-semibold text-lg">{item.voiceRoomName}</p>
      </div>

      {connectToVoice && (
  <div className="w-full flex flex-col mt-3 space-y-3">
    <div className="flex items-center gap-3 bg-[#313338] p-2 rounded-lg shadow-md">
      <div className="w-full h-full flex gap-2">
        <img
          className="w-6 h-6 rounded-full"
          src={`http://localhost:5000${user?.profilePic}`}
          alt=""
        />
        <p>{user?.username}</p>
      </div>
      <div>
        <div className="flex text-white text-base gap-2 items-center">
          <div
            onClick={() => setTurnMicOff(!turnMicOff)}
            className={`cursor-pointer transition duration-200 ${
              turnMicOff ? "text-red-600" : ""
            }`}
          >
            {turnMicOff ? <PiMicrophoneSlashFill /> : <FaMicrophone />}
          </div>

          <div
            onClick={() => setTurnHeadOff(!turnHeadOff)}
            className={`cursor-pointer transition duration-200 ${
              turnHeadOff ? "text-red-600" : ""
            }`}
          >
            {turnHeadOff ? <TbHeadphonesOff /> : <FaHeadphones />}
          </div>

          {/* Disconnect Button */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleDisconnect();
            }}
            className="cursor-pointer text-red-600 transition duration-200"
          >
            <FaSignOutAlt /> 
          </div>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ChannelVoiceItem;
