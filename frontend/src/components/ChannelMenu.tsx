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
import { ImConnection } from "react-icons/im";
import { PiPhoneDisconnectFill } from "react-icons/pi";


const ChannelMenu = () => {
  const {
    singleChannel,
    setOpenCreateRoom,
    openCreateRoom,
    setOpenCreateVoiceRoom,
    openCreateVoiceRoom,
    loading
  } = useUserContext();



  const [openChannelSettingArea, setOpenChannelSettingArea] =
    useState<boolean>(false);
    const [isSucces,setIsSucces] = useState<boolean | null>(false || null);

    const {user} = useUserContext();

    const getLink = async()=>{
      try {
        const response = await axios.post("http://localhost:5000/api/channel/createinvite",{
          channelId:singleChannel?._id
        })
        if(response.status === 200){
          await navigator.clipboard.writeText(response.data.inviteLink)
          setIsSucces(true);
        }
      } catch (error) {
        console.log(error);
        setIsSucces(false);
        
      }
    }

    

  return (
    <>
    <div className="w-[270px] h-screen bg-[#2B2D31] flex flex-col relative">
      {
        loading ? <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-semibold">Loading...</p>
        </div>
      </div> :
        <>
        <div className="w-full h-16 flex items-center border-b border-gray-800 justify-between px-5">
        <div className="font-bold text-[#D6D9DC] text-xl  ">
          {singleChannel?.channelName}
        </div>
        {
          user?.userId === singleChannel?.admin[0] &&
          <div
          onClick={() => setOpenChannelSettingArea(!openChannelSettingArea)}
          className="text-white text-xl font-semibold"
        >
          <IoIosArrowDown />
        </div>
        }
      </div>
      <div className="w-full h-auto">
        <div className="w-full text-gray-400 flex items-center justify-between p-5 font-bold">
          <p className="hover:text-gray-200 cursor-pointer">Chat Channel</p>
         {
          user?.userId === singleChannel?.admin[0] &&
          <GoPlus
          onClick={() => setOpenCreateRoom(!openCreateRoom)}
          className="hover:text-gray-200 cursor-pointer"
        />
         }
        </div>

        <div className="w-full h-auto flex flex-col gap-5">
          {singleChannel?.chatChannel.map((item, index) => (
            <ChannelChatItem key={index} chatName={item.roomName} />
          ))}
        </div>

        <div className="w-full text-gray-400 flex items-center justify-between p-5 font-bold mt-5">
          <p className="hover:text-gray-200 cursor-pointer">Voice Channel</p>
         {
          user?.userId === singleChannel?.admin[0] &&
          <GoPlus
          onClick={() => setOpenCreateVoiceRoom(!openCreateVoiceRoom)}
          className="hover:text-gray-200 cursor-pointer"
        />
         }
        </div>

        <div className="w-full h-auto flex flex-col gap-3">
          {singleChannel?.voiceChannel.map((item, index) => (
            <ChannelVoiceItem key={index} item={item}  />
          ))}
        </div>
      </div>
      {openChannelSettingArea &&  (
        <div className="w-full max-w-md h-auto bg-[#1F1F23] absolute top-0 rounded-lg shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="w-full p-4 bg-[#2D2F33] border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-white text-xl font-semibold">
            Channel Settings
          </h2>
          <button
            onClick={() => setOpenChannelSettingArea(!openChannelSettingArea)}
            className="text-gray-400 hover:text-red-500 transition-colors duration-300"
          >
            ✖
          </button>
        </div>
      
        {/* Content Section */}
        <div className="w-full p-6 flex flex-col items-start gap-6">
          <button
            onClick={() => getLink()}
            className={`w-full h-12 px-4 bg-gray-700 ${
              isSucces && "bg-green-500 hover:bg-green-600"
            } text-white font-medium rounded-md hover:bg-gray-600 transition-all duration-300 ease-in-out shadow-md`}
          >
            {isSucces ? (
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Link copied
              </span>
            ) : (
              "Get Link"
            )}
          </button>
        </div>
      </div>
      
      )}
        </>
      }
      <BottomProfile />
    </div>
    {openCreateRoom && <CreateRoom />}
      {openCreateVoiceRoom && <CreateVoiceRoom />}
    </>
  );
};

export default ChannelMenu;
