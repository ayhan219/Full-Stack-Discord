import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

const AddFriendMenu = () => {
  const [friendName, setFriendName] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [messages,setMessages] = useState<string>("");

  const handleAddFriend = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/addfriend",
        {
          userId: user?.userId,
          friendName,
        }
      );
  
      console.log(response.data);
  
      if (response.status === 200) {
        setIsSuccess(true);
        setMessages("Friend request sent successfully!"); 
      } else {
        setIsSuccess(false);
        setMessages("Failed to send friend request.");
      }
    } catch (error: any) {
      console.log(error);
  
      const errorMessage =
        error.response?.data?.message || error.message || "An unexpected error occurred.";
      setMessages(errorMessage);
  
      setIsSuccess(false);
    }
  };
  

  const { user } = useUserContext();

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
            onChange={(e) => setFriendName(e.target.value)}
            value={friendName}
            className={`flex-grow bg-transparent outline-none text-white p-3 `}
            placeholder="You can add friends with their Discord username"
            type="text"
          />
          <button
            onClick={handleAddFriend}
            className={`w-40 h-8 text-white rounded-md ${
              isSuccess === true
                ? "bg-green-500"
                : isSuccess === false
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            Send friend request
          </button>
        </div>
        
      </div>
      {
        !isSuccess && isSuccess!==null && <div className="w-full h-auto px-6 text-red-600 font-semibold text-sm">
          <p>{messages}</p>
        </div>
      }
    </div>
  );
};

export default AddFriendMenu;
