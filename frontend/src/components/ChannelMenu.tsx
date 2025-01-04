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
  } = useUserContext();



  const [openChannelSettingArea, setOpenChannelSettingArea] =
    useState<boolean>(false);
    const [isSucces,setIsSucces] = useState<boolean | null>(false || null);
    const [connectToVoice,setConnectToVoice] = useState<boolean>(false);

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

    const handleDisconnectFromVoice = async()=>{
      try {
        const response = await axios.delete("http://localhost:5000/api/channel/deleteuserfromvoicechannel",{
          data:{
            userId:user?.userId,
          channelId:singleChannel?._id,
          }

        })
        if(response.status ===200){
          setConnectToVoice(false)
        }
        
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <>
    <div className="w-[270px] h-screen bg-[#2B2D31] flex flex-col relative">
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
            <ChannelVoiceItem key={index} item={item} connectToVoice={connectToVoice} setConnectToVoice={setConnectToVoice}  />
          ))}
        </div>
      </div>
      {openChannelSettingArea &&  (
        <div className="w-full h-64 bg-[#2D2F33] absolute top-14 rounded-lg shadow-lg">
          {/* Header Section */}
          <div className="w-full p-4 border-b border-gray-600 flex items-center justify-between">
            <h2 className="text-white text-lg font-semibold">
              Channel Settings
            </h2>
            <button onClick={()=>setOpenChannelSettingArea(!openChannelSettingArea)} className="text-gray-400 hover:text-white transition">
              ✖
            </button>
          </div>

          {/* Content Section */}
          <div className="w-full p-6 flex flex-col items-start gap-4">
            <button onClick={()=>getLink()} className={`w-40 h-12 bg-blue-600 ${isSucces && "bg-green-500 hover:bg-green-500"} text-white font-medium rounded-md hover:bg-blue-700 transition`}>
              {
                isSucces ? "Link copied" : "get link"
              }
            </button>
            <button className="w-40 h-12 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 transition">
              Edit Channel
            </button>
            <button className="w-40 h-12 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition">
              Delete Channel
            </button>
          </div>
        </div>
      )}
      {
        connectToVoice &&  <div className="absolute bottom-16 p-4 w-full h-auto text-white bg-[#313338] flex justify-between py-2">
        <div className="text-green-600 text-2xl flex gap-2">
          <ImConnection />
          <p className="text-sm">connected</p>
        </div>
        <div className="text-red-600 font-semibold text-2xl cursor-pointer ">
          <PiPhoneDisconnectFill onClick={()=>handleDisconnectFromVoice()}  />
        </div>
      </div>
      }
      <BottomProfile />
    </div>
    {openCreateRoom && <CreateRoom />}
      {openCreateVoiceRoom && <CreateVoiceRoom />}
    </>
  );
};

export default ChannelMenu;
