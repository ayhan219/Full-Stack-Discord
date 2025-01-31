import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { MdClose } from "react-icons/md";
import axios from "axios";
import { useState } from "react";

type MenuFriendProps = {
  item: {
    username: string;
    _id: string;
    profilePic: string;
  };
  activeMenuFriend:string;
  setActiveMenuFriend:(activeMenuFriend:string)=>void;
};


interface Friend {
  username: string;
  _id: string;
  profilePic: string;
}

type User = {
  userId: string;
  email: string;
  displayName: string;
  username: string;
  profilePic: string;
  friends: Friend[];
  pendingFriend: Friend[];
  menuChat: Friend[];
};

const MenuFriends = ({ item,setActiveMenuFriend,activeMenuFriend }: MenuFriendProps) => {
  const { user,setUser } = useUserContext();
  const navigate = useNavigate();
  const { setFriendId,onlineFriends } = useUserContext();
  

  const setFriend = async () => {
    setFriendId(item._id);
    localStorage.setItem("friendId", item._id);
    localStorage.setItem("profilePic", item.profilePic);
    localStorage.setItem("username", item.username);
  };

  const deleteMenuFriend = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/auth/deletemenuchat",
        {
          data: {
            userId: user?.userId,
            friendId: item._id,
          },
        }
      );
      if(response.status===200){
        setUser((prev:User | null)=>{
          if(!prev){
            return prev
          }
          return{
            ...prev,
            menuChat:response.data
            
          }
        })
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      onClick={() => {
        setFriend();
        navigate(`/friendchat/${item._id}`);
        setActiveMenuFriend(item._id);
      }}
      className={`w-full h-12 flex items-center px-6 p-1 gap-3 ${activeMenuFriend === item._id ? "bg-[#4c515a] text-white rounded-md" : ""}  hover:bg-gray-600 cursor-pointer hover:rounded-lg transition-all text-gray-400 hover:text-white relative group`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="w-9 h-9 rounded-full"
              src={`http://localhost:5000${item.profilePic}`}
              alt=""
            />
            {
              onlineFriends.some((friend)=>friend._id === item._id) ?
              <div className="w-3 h-3 rounded-full bg-green-700 absolute right-0 bottom-0 "></div> 
              :
              <div className="w-3 h-3 rounded-full bg-[#72767E] absolute right-0 bottom-0 flex items-center justify-center border-2 border-gray-700">
                <div className="w-1 h-1 rounded-full bg-gray-600">

                </div>
              </div> 
            }
          </div>
          <div className="font-semibold">
            <p>{item.username}</p>
            {
              onlineFriends.some((friend)=>friend._id === item._id) ?
              <p className="text-xs text-green-500">online</p> :
              <p className="text-xs ">offline</p>
            }
          </div>
        </div>

        <div onClick={(e)=>{
          e.stopPropagation();
          deleteMenuFriend();
        }} className="absolute right-3 opacity-0 group-hover:opacity-100  text-white font-semibold text-xl">
          <MdClose className="cursor-pointer"  />
        </div>
      </div>
    </div>
  );
};

export default MenuFriends;
