import { GoPlus } from "react-icons/go";
import ChannelChatItem from "./ChannelChatItem";
import ChannelVoiceItem from "./ChannelVoiceItem";
import BottomProfile from "./BottomProfile";
import { useUserContext } from "../context/UserContext";
import { IoIosArrowDown } from "react-icons/io";
import CreateRoom from "./CreateRoom";
import CreateVoiceRoom from "./CreateVoiceRoom";
import { useState } from "react";
import axios from "axios";
import { PiPhoneDisconnectFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import ChannelUserControlArea from "./ChannelUserControlArea";
import { CiSettings } from "react-icons/ci";
import ChannelGeneralSettingsArea from "./ChannelGeneralSettingsArea";

interface ChannelProps {
  setIsCameraOn:(isCameraOn:boolean)=>void;
  isCameraOn:boolean;
  activeRoom:string;
  setActiveRoom:(activeRoom:string)=>void;
  isAreaOpen:boolean;
  setIsAreaOpen:(isAreaOpen:boolean)=>void;
}

const ChannelMenu = ({setIsCameraOn,isCameraOn,setActiveRoom,activeRoom,isAreaOpen,setIsAreaOpen}:ChannelProps) => {
  const {
    singleChannel,
    setOpenCreateRoom,
    openCreateRoom,
    setOpenCreateVoiceRoom,
    openCreateVoiceRoom,
    loading,
    connectedToVoice,
  } = useUserContext();

  const [openChannelSettingArea, setOpenChannelSettingArea] =
    useState<boolean>(false);
  

  const navigate = useNavigate();

  const { user, setActiveChannel, setSelectedChatRoom, setChannels,whichChannelConnected } =
    useUserContext();


  const [openChannelGeneralSettingsArea,setOpenChannelGeneralSettingsArea] = useState<boolean>(false);

  

  

  return (
    <><div onClick={()=>console.log(whichChannelConnected)
    }  className={`w-[170px] md:w-[270px] h-full bg-[#2B2D31] ${!isAreaOpen ? "opacity-0 invisible md:visible md:opacity-100" : "opacity-100 visible" } absolute z-20 md:static left-[4.4rem] md:flex flex-col transition-all duration-200 ease-in-out`}>

        <div className="flex flex-col w-full h-full gap-2 relative transform hover:scale-100">
        {loading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
              <p className="mt-4 text-white font-semibold">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full h-16 flex items-center border-b border-gray-800 justify-between px-5">
              <div className="font-bold text-[#D6D9DC] text-base md:text-xl  ">
                {singleChannel?.channelName}
              </div>
              {user?.userId === singleChannel?.admin[0] && (
                <div
                  onClick={() =>
                    setOpenChannelSettingArea(!openChannelSettingArea)
                  }
                  className="text-white text-xl font-semibold"
                >
                  <IoIosArrowDown />
                </div>
              )}
            </div>
            <div className="w-full h-auto">
              <div className="w-full text-gray-400 flex items-center justify-between p-5 font-bold">
                <p className="hover:text-gray-200 text-sm md:text-base cursor-pointer">
                  Chat Channel
                </p>
                {user?.userId === singleChannel?.admin[0] && (
                  <GoPlus
                    onClick={() => setOpenCreateRoom(!openCreateRoom)}
                    className="hover:text-gray-200 cursor-pointer"
                  />
                )}
              </div>

              <div className="w-full h-auto flex flex-col gap-5">
                {singleChannel?.chatChannel.map((item, index) => (
                  <ChannelChatItem key={index} chatName={item.roomName} setIsAreaOpen={setIsAreaOpen} />
                ))}
              </div>

              <div className="w-full text-gray-400 flex items-center justify-between p-5 font-bold mt-5">
                <p className="hover:text-gray-200 text-sm md:text-base cursor-pointer">
                  Voice Channel
                </p>
                {user?.userId === singleChannel?.admin[0] && (
                  <GoPlus
                    onClick={() => setOpenCreateVoiceRoom(!openCreateVoiceRoom)}
                    className="hover:text-gray-200 cursor-pointer"
                  />
                )}
              </div>

              <div className={`flex flex-col gap-3 custom-scrollbar overflow-y-auto ${connectedToVoice ? "h-[450px]" : "h-[600]"}`}>
                {singleChannel?.voiceChannel.map((item, index) => (
                  <ChannelVoiceItem key={index} item={item} activeRoom={activeRoom} setActiveRoom={setActiveRoom} />
                ))}
              </div>
            </div>
            {openChannelSettingArea && (
              <div className="w-full max-w-md h-auto bg-[#313338] absolute top-0 rounded-lg shadow-2xl overflow-hidden">
              {/* Header Section */}
              <div className="w-full p-4 bg-[#2D2F33] border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-white text-sm md:text-xl font-semibold">Channel Settings</h2>
                <button onClick={()=>setOpenChannelSettingArea(!openChannelSettingArea)} className="p-2 rounded-lg hover:bg-gray-600 transition">
                  <CiSettings className="text-white text-xl md:text-2xl" />
                </button>
              </div>
            
              {/* Settings Options */}
              <div className="p-4 space-y-3">
                <div onClick={()=>{
                  setOpenChannelGeneralSettingsArea(true)
                  setOpenChannelSettingArea(false)
                }} className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#2D2F33] p-3 rounded-lg cursor-pointer transition">
                  <CiSettings className=" text-base md:text-2xl" />
                  <p className="text-sm md:text-md">General Settings</p>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#2D2F33] p-3 rounded-lg cursor-pointer transition">
                  <CiSettings className="text-base md:text-2xl" />
                  <p className="text-sm md:text-md">Privacy</p>
                </div>
                <div className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#2D2F33] p-3 rounded-lg cursor-pointer transition">
                  <CiSettings className="text-base md:text-2xl" />
                  <p className="text-sm md:text-md">Notifications</p>
                </div>
              </div>
            </div>
            
            )}
          </>
        )}
        {connectedToVoice && (
          <div className="absolute w-full bottom-16">
            <ChannelUserControlArea isCameraOn={isCameraOn} setIsCameraOn={setIsCameraOn} />
          </div>
        )}
        <div className="absolute bottom-0 w-full">
          <BottomProfile />
        </div>
        </div>
      </div>
      
      {
        openChannelGeneralSettingsArea && <ChannelGeneralSettingsArea setOpenChannelGeneralSettingsArea={setOpenChannelGeneralSettingsArea} />
      }

      {openCreateRoom && <CreateRoom />}
      {openCreateVoiceRoom && <CreateVoiceRoom />}
    </>
  );
};

export default ChannelMenu;
