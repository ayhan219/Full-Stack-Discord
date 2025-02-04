import { Link } from "react-router-dom";
import discordPNG from "../assets/pngegg.png";
import Server from "./Server";
import { GoPlus } from "react-icons/go";
import { useUserContext } from "../context/UserContext";
import CreateChannel from "./CreateChannel";
import { useEffect } from "react";
import axios from "axios";
import FriendNotification from "./FriendNotification";
import "../index.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface SidebarProps {
  isAreaOpen:boolean;
  setIsAreaOpen:(isAreaOpen:boolean)=>void;
}

const Sidebar = ({isAreaOpen,setIsAreaOpen}:SidebarProps) => {
  const {
    user,
    channels,
    setChannels,
    notificationNumber,
    url,
    setLoading,
    userMessageNotification,
  } = useUserContext();

  const {
    openCreateChannel,
    setOpenCreateChannel,
    setSelectedChatRoom,
    activeChannel,
    setActiveChannel,
  } = useUserContext();


  const getChannelInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/channel/getchannel`,
        {
          params: {
            userId: user?.userId,
          },
        }
      );
      setChannels(response.data.channels);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChannelInfo();
  }, []);

  return (
    <>
    <div className={`${!isAreaOpen ? "w-[30px] bg-[#33343a] md:bg-[#1E1F22]" : "w-[70px]   z-50"} md:w-[80px] absolute z-50 md:static   h-screen bg-[#1E1F22] flex flex-col  overflow-y-auto custom-scrollbar2   pt-4 gap-3 transition-all duration-200 ease-in-out`}>
      <div className="flex md:hidden w-full justify-center">
        {
          !isAreaOpen ? <FaArrowRight onClick={()=>setIsAreaOpen(true)} className="cursor-pointer transform hover:scale-100" /> :
          <FaArrowLeft onClick={()=>setIsAreaOpen(false)} className="cursor-pointer transform hover:scale-100" />
        }
        </div>
      <div className={`${!isAreaOpen ? "hidden" : "flex"} md:flex flex-col gap-3`}>
        
      <div
        className={`relative flex items-center justify-center cursor-pointer ${
          activeChannel === "home" ? "group" : ""
        }`}
        onClick={() => {
          setActiveChannel("home");
          setSelectedChatRoom("");
        }}
      >
        <div
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-lg bg-white transition-all duration-300 ${
            activeChannel === "home" ? "opacity-100" : "opacity-0"
          }`}
        ></div>

        <div className="relative">
          <Link to={"/home"}>
            <img
              className="w-11 h-11 md:w-14 md:h-14 object-cover rounded-full relative"
              src={discordPNG}
              alt="Discord Icon"
            />
          </Link>
          <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md-h-5 bg-red-600 rounded-full flex items-center justify-center">
            <p className="text-white text-xs font-bold">{notificationNumber}</p>
          </div>
        </div>
      </div>
      <div className="w-full h-auto flex justify-center">
        <div className="w-[60%] h-[0.15rem] bg-[#35363C]"></div>
      </div>
      <div className="w-full h-auto flex flex-col gap-3">
        {userMessageNotification.map((item, index) => (
          <FriendNotification key={index} item={item} />
        ))}
      </div>
      {/* server area */}
      <div className="w-full h-auto flex flex-col gap-3">
        {channels.map((item, index) => (
          <Server
            key={index}
            item={item}
            index={index}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            isActive={activeChannel === item._id}
          />
        ))}

        <div className="w-full h-16 flex items-center justify-center relative">
          <div
            onClick={() => setOpenCreateChannel(!openCreateChannel)}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#3f4049] flex justify-center items-center cursor-pointer"
          >
            <div className=" text-green-500 font-bold text-2xl md:text-4xl">
              <GoPlus />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    {openCreateChannel && <CreateChannel />}
    </>
  );
};

export default Sidebar;
