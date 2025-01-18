import { IoCloseCircle } from "react-icons/io5";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Channel {
  _id: string;
  channelName: string;
}

const CreateChannel = () => {
  const {
    setOpenCreateChannel,
    openCreateChannel,
    user,
    setSingleChannel,
    setChannels,
    socket,
    setActiveChannel,
    getSingleChannel
  } = useUserContext();
  const [channelName, setChannelName] = useState<string>("");
  const navigate = useNavigate();

  const handleCreateChannel = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/channel/createchannel",
        {
          channelName,
          userId: user?.userId,
        }
      );
      if (response.status === 201) {
        setSingleChannel(response.data);
        console.log("here worked");
        
        setChannels((prev: Channel[]) => {
          return [response.data, ...prev];
        });
        setOpenCreateChannel(!openCreateChannel);
      }
      socket.emit("createServer", channelName, user?.userId);
      console.log(response.data);
      setActiveChannel(response.data._id)
      getSingleChannel(response.data._id);
      navigate("/channel")

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute inset-0 bg-opacity-60 z-10 bg-black flex justify-center items-center">
      <div className="w-[500px] bg-[#2c2f33] rounded-lg shadow-lg relative">
        {/* Header */}
        <div className="bg-[#202225] p-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">
            Create a New Server
          </h2>
          <IoCloseCircle
            onClick={() => setOpenCreateChannel(!openCreateChannel)}
            className="text-3xl cursor-pointer text-gray-400 hover:text-gray-300"
          />
        </div>

        {/* Form Section */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="serverName">
              Server Name
            </label>
            <input
              id="serverName"
              type="text"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
              className="w-full px-4 py-2 rounded-lg bg-[#23272a] text-white border border-[#202225] focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter the server name"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end p-4 bg-[#202225] rounded-b-lg space-x-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-lg hover:bg-gray-500"
            onClick={() => setOpenCreateChannel(!openCreateChannel)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500"
            onClick={handleCreateChannel}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateChannel;
