import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

type PendingFriendProps = {
  item:{
    username:string,
    _id:string,
    profilePic:string
  }
};

const PendingFriend = ({ item }: PendingFriendProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const { user,socket,setUser,getCurrentUser } = useUserContext();

  const handleAction = async (action: string) => {
    try {
      setSelectedValue(action);
      const response = await axios.post("http://localhost:5000/api/auth/acceptordeclinefriend", {
        userId: user?.userId,
        request: action,
        friendUserId: item, 
      });
      console.log(response.data);
      
      setUser(response.data)

      if(response.status===200){
        getCurrentUser();
      }
      socket.emit("sendAcceptOrDecNotificationToUser",user?.userId,selectedValue,user?.username);
      
    } catch (error) {
      console.error(error);
    }
  };

  const show = ()=>{
    console.log(item);
    
  }

  return (
    <div className="w-full h-16 px-3 border-b border-gray-600 flex justify-between">
      <div className="w-auto h-full flex gap-4 items-center ">
        <img onClick={()=>show()}
          className="w-8 h-8 rounded-full"
          src={`http://localhost:5000${item.profilePic}`}
          alt=""
        />
        <p className="text-[#9CA3AF] text-base">{item.username}</p>
      </div>
      <div className="w-24 h-full flex items-center gap-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
            selectedValue === "accept" ? "bg-green-500" : "bg-[#2B2D31]"
          }`}
          onClick={() => handleAction("accept")}
        >
          <TiTick className="text-white text-xl" />
        </div>
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer ${
            selectedValue === "decline" ? "bg-red-500" : "bg-[#2B2D31]"
          }`}
          onClick={() => handleAction("decline")} 
        >
          <IoClose className="text-white text-xl" />
        </div>
      </div>
    </div>
  );
};

export default PendingFriend;
