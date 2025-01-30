import { Link, useParams } from "react-router-dom";
import discordPNG from "../assets/pngegg.png";
import Server from "./Server";
import { GoPlus } from "react-icons/go";
import { useUserContext } from "../context/UserContext";
import CreateChannel from "./CreateChannel";
import { useEffect, useState } from "react";
import axios from "axios";
import FriendNotification from "./FriendNotification";
import "../index.css";

const Sidebar = () => {
  const {
    user,
    channels,
    setChannels,
    notificationNumber,
    loading,
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
        "http://localhost:5000/api/channel/getchannel",
        {
          params: {
            userId: user?.userId,
          },
        }
      );
      setChannels(response.data.channels);
      console.log("data getted from channel",response.data);
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
    <div className="w-[80px] h-screen bg-[#1E1F22] flex flex-col  overflow-y-auto custom-scrollbar2   pt-4 gap-3">
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
              className="w-14 h-14 object-cover rounded-full relative"
              src={discordPNG}
              alt="Discord Icon"
            />
          </Link>
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
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
            className="w-16 h-16 rounded-full bg-[#3f4049] flex justify-center items-center cursor-pointer"
          >
            <div className=" text-green-500 font-bold text-4xl">
              <GoPlus />
            </div>
          </div>
        </div>
      </div>
      {openCreateChannel && <CreateChannel />}
    </div>
  );
};

export default Sidebar;
