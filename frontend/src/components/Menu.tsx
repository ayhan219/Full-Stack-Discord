import { FaUserFriends } from "react-icons/fa";
import { IoLogoIonitron } from "react-icons/io";
import { FaEnvelope } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import MenuFriends from "./MenuFriends";
import BottomProfile from "./BottomProfile";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import FriendChat from "../pages/FriendChat";
import HomeFriend from "./HomeFriend";
import { useState } from "react";
import "../index.css"

type MenuProps ={
  activeMenu:string,
  setActiveMenu:(activeMenu:string)=>void;
  isAreaOpen:boolean,
  setIsAreaOpen:(isAreaOpen:boolean)=>void;
}

const Menu = ({activeMenu,setActiveMenu,isAreaOpen,setIsAreaOpen}:MenuProps ) => {

  const {user,activeMenuFriend,setActiveMenuFriend} = useUserContext();

  const navigate = useNavigate();
  
  
  return (
    <div className={`w-[170px] md:w-[270px] h-full bg-[#2B2D31] ${!isAreaOpen ? "opacity-0 invisible md:visible md:opacity-100" : "flex opacity-100 visible  "} absolute z-50 md:static left-[4.4rem]  md:flex flex-col transition-all ease-in-out duration-200`}>

      <div className="flex flex-col gap-2 relative transform hover:scale-100">
      <div className="w-full h-16 flex justify-center items-center">
        <input
          className="bg-[#1E1F22] w-[70%] md:w-[85%] h-9 outline-none text-white text-xs md:text-sm pl-2 rounded-lg placeholder:text-xs"
          placeholder="Find or start a conversation"
          type="text"
        />
      </div>
      <div className="w-full h-[20%] flex flex-col items-center gap-2 ">
        <div className="w-full h-12 hover:text-gray-300 hover:rounded-lg  text-gray-400 font-bold flex justify-center md:justify-normal  gap-2 cursor-pointer hover:bg-gray-500 duration-100 ease-in-out">
          <div onClick={()=>{
            setActiveMenu("friends")
            setActiveMenuFriend("");
            navigate("/home")
            {
              window.location.pathname==="/friendchat" && navigate("/home")
            }
          }} className="flex w-[70%] justify-evenly items-center">
            <FaUserFriends className="text-xl md:text-3xl" />
            <h2 className="w-20 text-sm md:text-base font-semibold">Friends</h2>
          </div>
        </div>

        <div className="w-full h-12 hover:text-gray-300 hover:rounded-lg text-gray-400 font-bold flex justify-center md:justify-normal  gap-2 cursor-pointer hover:bg-gray-500 duration-100 ease-in-out">
          <div onClick={()=>setActiveMenu("nitro")} className="flex w-[70%] justify-evenly items-center">
            <IoLogoIonitron className="text-xl md:text-3xl" />
            <h2 className="w-20 text-sm md:text-base font-semibold">Nitro</h2>
          </div>
        </div>

        <div className="w-full h-12 hover:text-gray-300 hover:rounded-lg text-gray-400 font-bold flex justify-center md:justify-normal  gap-2 cursor-pointer hover:bg-gray-500 duration-100 ease-in-out">
          <div onClick={()=>setActiveMenu("message")} className="flex w-[70%] justify-evenly items-center">
          <FaEnvelope className="text-xl md:text-3xl" />
          <h2 className="w-20 text-sm md:text-base font-semibold ">Message Request</h2>
          </div>
        </div>

        <div className="w-full h-12 hover:text-gray-300 hover:rounded-lg text-gray-400 font-bold flex justify-center md:justify-normal  gap-2 cursor-pointer hover:bg-gray-500 duration-100 ease-in-out">
          <div onClick={()=>setActiveMenu("shop")} className="flex w-[70%] justify-evenly items-center">
            <FaShop className="text-xl md:text-3xl" />
            <h2 className="w-20 text-sm md:text-base font-semibold ">Shop</h2>
          </div>
        </div>
      </div>
      <div className="w-full h-auto">
        <div className="w-full text-gray-400 text-xs md:text-sm font-semibold flex justify-between px-5 py-6 ">
        <h3>DIRECT MESSAGES</h3>
        <GoPlus className=" text-xl cursor-pointer" />
        </div>
        <div className="w-full h-[677px] flex flex-col gap-4 overflow-y-auto scrollbar-hidden ">
          {
            user?.menuChat.map((item,index)=>(
              <MenuFriends key={index} item={item} setActiveMenuFriend={setActiveMenuFriend} activeMenuFriend={activeMenuFriend} />
            ))
          }
        </div>

        
      </div>

      <div className="absolute -bottom-8 w-full">
      <BottomProfile />
      </div>
      </div>
    </div>
  );
};

export default Menu;
