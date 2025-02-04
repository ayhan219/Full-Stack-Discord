import { useState} from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";




const AddFriendMenu = () => {
  const [friendName, setFriendName] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [messages, setMessages] = useState<string>("");
  const { user,  socket,url } = useUserContext();

  const handleAddFriend = async () => {
    try {
      const response = await axios.post(
        `${url}/api/auth/addfriend`,
        {
          userId: user?.userId,
          friendName,
        }
      );

      
      if(response.status===200){
        setIsSuccess(true);
        setMessages("friend request sended!")
      }
  
      
      console.log(user?.profilePic);
      
      socket.emit("friendRequest", user?.userId, response.data,user?.username,user?.profilePic);
    } catch (error) {
      console.log(error);
      setMessages("error")
      setIsSuccess(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#313338]">
      <div className="w-auto h-auto text-[#E8EAEB] flex flex-col gap-2 p-6">
        <h3 className="font-bold">ADD FRIEND</h3>
        <p className=" text-xs md:text-sm text-[#969BA1]">
          You can add friends with their Discord username.
        </p>
      </div>
      <div className="w-full h-24 flex justify-center px-6">
        <div className="flex items-center w-full h-[50%] bg-[#1E1F22] rounded-lg px-3">
          <input
            onChange={(e) => setFriendName(e.target.value)}
            value={friendName}
            className={`flex-grow bg-transparent outline-none placeholder:text-xs text-white p-3`}
            placeholder="Enter friend's username"
            type="text"
          />
          <button
            onClick={handleAddFriend}
            className={`w-40 h-8 text-white rounded-md !text-xs !md:text-base ${
              isSuccess === true
                ? "bg-green-500"
                : isSuccess === false
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            Send
          </button>
        </div>
      </div>

      {messages && (
        <div className={`w-full h-auto px-6 ${isSuccess ? "text-green-600" : "text-red-600"}  font-semibold text-sm`}>
          <p>{messages}</p>
        </div>
      )}
    </div>
  );
};

export default AddFriendMenu;
