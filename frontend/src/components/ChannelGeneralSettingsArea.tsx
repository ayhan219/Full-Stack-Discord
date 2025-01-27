import React, { useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ChannelGeneralSettingsAreaProps {
  setOpenChannelGeneralSettingsArea: (isOpen: boolean) => void;
}

const ChannelGeneralSettingsArea = ({
  setOpenChannelGeneralSettingsArea,
}: ChannelGeneralSettingsAreaProps) => {
  const {
    singleChannel,
    user,
    setActiveChannel,
    setSelectedChatRoom,
    setChannels,
    channels,
    setSingleChannel,
  } = useUserContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [openDeleteArea, setOpenDeleteArea] = useState<boolean>(false);
  const [loadingForDelete, setLoadingForDelete] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();

    formData.append("channelPic", file);
    formData.append("channelId", singleChannel?._id || "");
    formData.append("userId", user?.userId || "");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/channel/uploadchannelphoto",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setChannels((prev) => {
          if (!prev) {
            return prev;
          }

          const updatedChannels = prev.map((item) => {
            if (item._id === singleChannel?._id) {
              return { ...item, channelPic: response.data };
            }
            return item;
          });

          return updatedChannels;
        });

        setSingleChannel((prev) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            channelPic: response.data,
          };
        });
      }
    } catch (error) {
      console.error("Error updating channel picture:", error);
    }
  };

  const handleDeleteChannel = async () => {
    setLoadingForDelete(true);
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/channel/deletechannel",
        {
          data: {
            userId: user?.userId,
            channelId: singleChannel?._id,
          },
        }
      );
      console.log(response.data);
      setActiveChannel("home");
      setOpenDeleteArea(false);
      setSelectedChatRoom("");

      setChannels((prev) => {
        if (!prev) {
          return prev;
        }
        const filteredChannel = prev.filter(
          (channel) => channel._id !== response.data._id
        );
        return filteredChannel;
      });

      navigate("/home");
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingForDelete(false);
    }
  };

  const initials = singleChannel?.channelName
    .split(" ")
    .map((word) => word.substring(0, 2))
    .join("")
    .toUpperCase();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="w-[90%] max-w-[800px] h-[90%] bg-[#23272A] rounded-2xl shadow-lg flex overflow-hidden">
        <div className="w-1/4 bg-[#2C2F33] flex flex-col p-4">
          <h2 className="text-lg font-bold text-white mb-6">Settings</h2>
          <nav className="space-y-3">
            <button className="w-full text-left py-2 px-4 bg-[#40444B] rounded-lg text-sm text-gray-300 hover:bg-[#5865F2] hover:text-white">
              Overview
            </button>
            <button className="w-full text-left py-2 px-4 bg-[#40444B] rounded-lg text-sm text-gray-300 hover:bg-[#5865F2] hover:text-white">
              Members
            </button>
            <button className="w-full text-left py-2 px-4 bg-[#40444B] rounded-lg text-sm text-gray-300 hover:bg-[#5865F2] hover:text-white">
              Roles
            </button>
            <button className="w-full text-left py-2 px-4 bg-[#40444B] rounded-lg text-sm text-gray-300 hover:bg-[#5865F2] hover:text-white">
              Integrations
            </button>
            <button className="w-full text-left py-2 px-4 bg-[#40444B] rounded-lg text-sm text-gray-300 hover:bg-red-600 hover:text-white">
              Delete Channel
            </button>
          </nav>
        </div>


        <div className="w-3/4 bg-[#36393F] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">
              Channel Overview
            </h2>
            <IoMdCloseCircle
              onClick={() => setOpenChannelGeneralSettingsArea(false)}
              className="text-gray-400 text-2xl cursor-pointer hover:text-gray-200"
            />
          </div>
          <div className="flex flex-col items-center justify-center p-6">
            <div className="relative group">
              {singleChannel?.channelPic ? (
                <img
                  className="w-32 h-32 rounded-full border-4 border-gray-600 shadow-md transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-xl"
                  src={`http://localhost:5000${singleChannel?.channelPic}`}
                  alt="Channel"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-md transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-xl">
                  <p className="text-black font-bold text-2xl">{initials}</p>
                </div>
              )}

              <label
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 rounded-full transition-all duration-300 ease-in-out cursor-pointer group-hover:bg-opacity-40"
                htmlFor="file-input"
              >
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100">
                  Change Picture
                </span>
              </label>
            </div>

            <input
              id="file-input"
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />

            <h3 className="mt-4 text-lg font-medium text-gray-200">
              {singleChannel?.channelName || "Unnamed Channel"}
            </h3>
            <p className="mt-2 text-gray-400">
              Members: {singleChannel?.channelUsers?.length || 0}
            </p>
          </div>

          <div className="p-6 space-y-4">
            <button className="w-full py-3 bg-[#40444B] hover:bg-[#5865F2] rounded-lg text-sm text-gray-300 hover:text-white">
              Update Channel Name
            </button>
            <button className="w-full py-3 bg-[#40444B] hover:bg-[#5865F2] rounded-lg text-sm text-gray-300 hover:text-white">
              Manage Permissions
            </button>
            <button
              onClick={() => setOpenDeleteArea(!openDeleteArea)}
              className="w-full py-3 bg-[#40444B] hover:bg-[#5865F2] rounded-lg text-sm text-gray-300 hover:text-white"
            >
              Delete Channel
            </button>
          </div>
        </div>
      </div>

      {openDeleteArea && (
        <div className="inset-0 bg-black bg-opacity-55 fixed flex items-center justify-center">
          <div className="w-[400px] bg-[#2B2D31] rounded-lg shadow-lg p-6">
            <div className="text-center text-white font-bold text-xl mb-4">
              <h2>Are you sure?</h2>
            </div>
            <div className="text-center text-gray-300 text-sm mb-6">
              <p>
                If you select "Delete," you will permanently lose access to this
                channel, and it cannot be recovered.
              </p>
            </div>
            <div className="flex justify-between">
              {loadingForDelete ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                    <p className="mt-4 text-white font-semibold">Loading...</p>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setOpenDeleteArea(false)}
                    className="w-[48%] h-12 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 transition-all duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteChannel()}
                    className="w-[48%] h-12 bg-red-600 text-white font-medium rounded-lg hover:bg-red-500 transition-all duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelGeneralSettingsArea;
