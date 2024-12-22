import React, { act, useState } from "react";
import { FaUserFriends } from "react-icons/fa";
import { useUserContext } from "../context/UserContext";

type TopBarProps = {
  activeTopBarMenu: string;
  setActiveTopBarMenu: (activeTopBarMenu: string) => void;
};

const TopBar = ({ activeTopBarMenu, setActiveTopBarMenu }: TopBarProps) => {
  function handleActiveMenu(activeMenu: string): void {
    setActiveTopBarMenu(activeMenu);
  }

  const { user } = useUserContext();

  return (
    <div className="w-full h-12  bg-[#313338] px-7  border-b-2 border-gray-800 flex">
      <div className="w-36 h-full text-gray-400 font-semibold flex items-center gap-3 ">
        <FaUserFriends className="text-3xl" />
        <h3 className="text-lg text-white">Friends</h3>
        <div className="w-[0.13px] h-[40%] bg-gray-300"></div>
      </div>
      <div className=" w-[70%] md:w-full h-full px-3 flex">
        <div className="text-gray-400 font-semibold hidden md:flex items-center cursor-pointer gap-7 text-base ">
          <div className="flex items-center">
            <a
              onClick={() => handleActiveMenu("online")}
              className={`px-2 py-1 text-center flex items-center gap-2 ${
                activeTopBarMenu === "online" &&
                "bg-[#44474d] rounded-sm text-white"
              }`}
            >
              Online
            </a>
          </div>

          <div className="flex items-center">
            <a
              onClick={() => handleActiveMenu("all")}
              className={`px-2 py-1 text-center flex items-center gap-2 ${
                activeTopBarMenu === "all" &&
                " bg-[#44474d] rounded-sm text-white"
              }`}
            >
              All
            </a>
          </div>
          <div className="flex items-center">
            <a
              onClick={() => handleActiveMenu("pending")}
              className={`px-2 py-1 text-center flex items-center gap-2 ${
                activeTopBarMenu === "pending" &&
                " bg-[#44474d] rounded-sm text-white"
              }`}
            >
              Pending
             
                <div
                className={`w-4 h-4 items-center justify-center rounded-full text-white bg-red-600 text-xs ${
                 user?.pendingFriend && user?.pendingFriend?.length > 0 ? "flex" : "hidden"
                }`}
              >
                <p>{user?.pendingFriend.length}</p>
              </div>
            </a>
          </div>

          <div className="flex items-center">
            <a
              onClick={() => handleActiveMenu("suggestions")}
              className={`px-2 py-1 text-center flex items-center gap-2 ${
                activeTopBarMenu === "suggestions" &&
                " bg-[#44474d] rounded-sm text-white"
              }`}
            >
              Suggestions
              
            </a>
          </div>

          <a
            onClick={() => handleActiveMenu("blocked")}
            className={`px-2 py-1 text-center ${
              activeTopBarMenu === "blocked" &&
              " bg-[#44474d] rounded-sm text-white"
            }`}
          >
            Blocked
          </a>
          <div className="w-auto h-auto">
            <button
              onClick={() => handleActiveMenu("addfriend")}
              className="bg-green-800 w-24 h-8 rounded-lg text-white"
            >
              Add Friend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
