import { IoCloseCircle } from "react-icons/io5";
import { useUserContext } from "../context/UserContext"
import axios from "axios";
import { useState } from "react";






const CreateRoom = () => {

    const {openCreateRoom,setOpenCreateRoom} = useUserContext();
    const [chatRoomName,setChatRoomName] = useState<string>("");
    const {user,singleChannel,setSingleChannel} = useUserContext();

    const handleAddChatRoom = async()=>{
        try {
          const response = await axios.post("http://localhost:5000/api/channel/createchatroom",{
            channelId:singleChannel?._id,
            userId:user?.userId,
            chatRoomName:chatRoomName
          })
          if (response.status === 200) {
            window.location.reload();
          }
        } catch (error) {
          console.log(error);
          
        }
      }


    
  return (
    <div className="absolute inset-0 bg-opacity-60 z-10 bg-black flex justify-center items-center">
      <div className="w-[500px] bg-[#2c2f33] rounded-lg shadow-lg relative">
        <div className="bg-[#202225] p-4 rounded-t-lg flex justify-between items-center">
                  <h2 className="text-white text-lg font-semibold">Enter room name</h2>
                  <IoCloseCircle
                    onClick={() => setOpenCreateRoom(!openCreateRoom)}
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
              onChange={(e)=>setChatRoomName(e.target.value)}
              value={chatRoomName}
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-[#23272a] text-white border border-[#202225] focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter the room name"
            />
          </div>
          
        </div>
        <div className="flex justify-end p-4 bg-[#202225] rounded-b-lg space-x-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500"
            
          >
            Cancel
          </button>
          <button
          onClick={()=>handleAddChatRoom()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500"
          >
            Create
          </button>
        </div>
      </div>

      </div>
  )
}

export default CreateRoom
