import { IoCloseCircle } from "react-icons/io5";
import { useUserContext } from "../context/UserContext"
import axios from "axios";
import { useState } from "react";




interface ChatChannel {
  roomName: string;
  messages: string[];
}

interface SingleChannel {
  _id: string;
  channelName: string;
  chatChannel: ChatChannel[];
  voiceChannel: VoiceChannel[];
  admin: string[];
  channelUsers: VoiceUser[];
  channelPic: string;
}

type VoiceUser = {
  _id: string;
  username: string;
  profilePic: string;
};

interface VoiceChannel {
  voiceRoomName: string;
  voiceUsers: VoiceUser[];
  _id: string;
}




const CreateVoiceRoom = () => {

    const {openCreateVoiceRoom,setOpenCreateVoiceRoom,url} = useUserContext();
    const [voiceRoomName,setVoiceRoomName] = useState<string>("");
    const {user,singleChannel,setSingleChannel,socket} = useUserContext();
    const [isCreating, setIsCreating] = useState<boolean>(false);

    const handleAddVoiceRoom = async()=>{
      if (isCreating) return;
    setIsCreating(true);
        try {
          const response = await axios.post(`${url}/api/channel/createvoiceroom`,{
            channelId:singleChannel?._id,
            userId:user?.userId,
            voiceRoomName:voiceRoomName
          })
          if (response.status === 200) {
            const voiceRoomName = response.data
            setSingleChannel((prev: SingleChannel | null)=>{
              if (!prev) return prev;
              return{
                ...prev,
                voiceChannel:[...prev.voiceChannel,voiceRoomName]
              }
            })
            setOpenCreateVoiceRoom(!openCreateVoiceRoom);
            socket.emit("sendDataToChannelVoiceUsers",{
              channelId:singleChannel?._id,
              voiceRoomName,
              channelUsers:singleChannel?.channelUsers
            })
          
          }
        } catch (error) {
          console.log(error);
        }
        finally {
          setIsCreating(false);
        }
      }


    
  return (
    <div className="absolute inset-0 bg-opacity-60 z-50 bg-black flex justify-center items-center">
      <div className="w-[500px] bg-[#2c2f33] rounded-lg shadow-lg relative">
        <div className="bg-[#202225] p-4 rounded-t-lg flex justify-between items-center">
                  <h2 className="text-white text-lg font-semibold">Enter room name</h2>
                  <IoCloseCircle
                    onClick={() => setOpenCreateVoiceRoom(!openCreateVoiceRoom)}
                    className="text-3xl cursor-pointer text-gray-400 hover:text-gray-300"
                  />
                </div>

                <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="serverName">
              Room name
            </label>
            <input
              id="serverName"
              onChange={(e)=>setVoiceRoomName(e.target.value)}
              value={voiceRoomName}
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-[#23272a] text-white border border-[#202225] focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter the room name"
              disabled={isCreating}
            />
          </div>
          
        </div>
        <div className="flex justify-end p-4 bg-[#202225] rounded-b-lg space-x-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500"
            onClick={() => setOpenCreateVoiceRoom(false)}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${isCreating ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-500"}`}
            onClick={handleAddVoiceRoom}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      </div>
  )
}

export default CreateVoiceRoom
