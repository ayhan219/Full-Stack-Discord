import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

const AddFriendMenu = () => {
    const [friendName,setFriendName] = useState<string>("");

    const handleAddFriend = async()=>{
        try {
            const response = await axios.post("http://localhost:5000/api/auth/addfriend",{
              userId:user?.userId,
              friendName
            })
            
            
            console.log(response);
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const {user} = useUserContext();

  return (
    <div className="w-full h-full bg-[#313338]">
      <div className="w-auto h-auto text-[#E8EAEB] flex flex-col gap-2  p-6">
        <h3 className="font-bold">ADD FRIEND</h3>
        <p className="text-sm text-[#969BA1]">
          You can add friends with their Discord username.
        </p>
      </div>
      <div className="w-full h-24 flex justify-center px-6">
        <div className="flex items-center w-full h-[50%] bg-[#1E1F22] rounded-lg px-3">
          <input
            onChange={(e)=>setFriendName(e.target.value)}
            value={friendName}
            className="flex-grow bg-transparent outline-none text-white p-3"
            placeholder="You can add friends with their Discord username"
            type="text"
          />
          <button onClick={()=>handleAddFriend()} className="w-40 h-8 text-white bg-blue-700 rounded-md">
            Send friend request
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendMenu;
