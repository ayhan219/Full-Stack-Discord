import axios from "axios";
import { IoChatbubble } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useEffect } from "react";

type HomeFriendProps = {
  item: {
    username: string;
    _id: string;
    profilePic:string;
  };
};

type User = {
  userId: string;
  email: string;
  displayName: string;
  username: string;
  profilePic:string;
  friends: Friend[];
  pendingFriend: Friend[];
  menuChat: Friend[];
};

interface Friend {
  username: string;
  _id: string;
  profilePic:string
}

const HomeFriend = ({ item }: HomeFriendProps) => {
  const navigate = useNavigate();

  const { user, setUser,setFriendId } = useUserContext();

  const addToMenuChat = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/addtomenuchat",
        {
          userId: user?.userId,
          friendUserId: item._id,
        }
      );
      console.log(response);
      if (response.status === 200) {
        setUser((prev: User | null) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            menuChat: [response.data, ...prev.menuChat],
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

 const setFriend = async()=>{
  setFriendId(item._id);
  localStorage.setItem("friendId",item._id);
  localStorage.setItem("profilePic",item.profilePic);
  localStorage.setItem("username",item.username);
 }

  return (
    <div
      onClick={() => {
        navigate("/friendchat");
        addToMenuChat();
        setFriend();
      }}
      className="w-full h-14 text-gray-300 font-semibold flex p-3 px-6 items-center border-t border-gray-600 justify-between hover:bg-gray-600 cursor-pointer hover:rounded-lg transition-all"
    >
      <div className="flex justify-center items-center gap-4">
        <div className="relative">
          <img
            src={`http://localhost:5000${item.profilePic}`}
            alt={`${item}'s profile`}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-500"
          />
           <div className="w-3 h-3 rounded-full bg-green-700 absolute right-0 bottom-0"></div>
        </div>
        <h3 className="text-md text-white font-medium">{item.username}</h3>
      </div>

      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1E1F22] hover:bg-gray-500 transition-all">
        <IoChatbubble className="text-gray-300 text-2xl cursor-pointer hover:text-white" />
      </div>
    </div>
  );
};

export default HomeFriend;
