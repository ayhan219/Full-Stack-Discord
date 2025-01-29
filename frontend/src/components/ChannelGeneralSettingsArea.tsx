import React, { useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { CiSearch } from "react-icons/ci";
import { FaBan } from "react-icons/fa";

interface Member {
  username: string;
  _id: string;
  profilePic: string;
}




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
    socket,
  } = useUserContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [openDeleteArea, setOpenDeleteArea] = useState<boolean>(false);
  const [loadingForDelete, setLoadingForDelete] = useState<boolean>(false);
  const [isSucces, setIsSucces] = useState<boolean | null>(false || null);
  const navigate = useNavigate();

  const [channelGeneralSettings, setChannelGeneralSettings] =
    useState<string>("overview");

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

  const getLink = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/channel/createinvite",
        {
          channelId: singleChannel?._id,
        }
      );
      if (response.status === 200) {
        await navigator.clipboard.writeText(response.data.inviteLink);
        setIsSucces(true);
      }
    } catch (error) {
      console.log(error);
      setIsSucces(false);
    }
  };

  const kickUserFromChannel = async(kickUserId:string)=>{
    try {
      const channelId = singleChannel?._id
      const response = await axios.delete("http://localhost:5000/api/channel/kickuser",{
        data:{
          channelId:channelId,
          userId:user?.userId,
          kickUserId:kickUserId
        }
      })
      if(response.status===200){
        setSingleChannel((prev)=>{
          if(!prev){
            return prev;
          }
          return {
            ...prev,
            channelUsers: prev.channelUsers.filter((item: Member) => item._id !== kickUserId),
          };
          
        })
        socket.emit("userKickedFromChannel",{channelId,kickUserId})
      }
      
      
    } catch (error) {
      console.log(error);
      
    }
  }

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
            <button
              onClick={() => setChannelGeneralSettings("overview")}
              className={`w-full text-left py-2 px-4 bg-[#40444B] rounded-lg text-sm ${
                channelGeneralSettings === "overview" &&
                "bg-blue-700 text-white"
              } text-gray-300 hover:bg-[#5865F2] hover:text-white`}
            >
              Overview
            </button>
            <button
              onClick={() => setChannelGeneralSettings("members")}
              className={`w-full text-left py-2 px-4 bg-[#40444B] rounded-lg text-sm ${
                channelGeneralSettings === "members" && "bg-blue-700 text-white"
              } text-gray-300 hover:bg-[#5865F2] hover:text-white`}
            >
              Members
            </button>
            <button
              onClick={() => setChannelGeneralSettings("roles")}
              className={`w-full text-left py-2 px-4 bg-[#40444B] rounded-lg text-sm ${
                channelGeneralSettings === "roles" && "bg-blue-700 text-white"
              } text-gray-300 hover:bg-[#5865F2] hover:text-white`}
            >
              Roles
            </button>
            <button
              onClick={() => setChannelGeneralSettings("integrations")}
              className={`w-full text-left py-2 px-4 bg-[#40444B] rounded-lg text-sm ${
                channelGeneralSettings === "integrations" &&
                "bg-blue-700 text-white"
              } text-gray-300 hover:bg-[#5865F2] hover:text-white`}
            >
              Integrations
            </button>
          </nav>
        </div>

        <div className="w-3/4 bg-[#36393F] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">
              Channel {channelGeneralSettings}
            </h2>
            <IoMdCloseCircle
              onClick={() => setOpenChannelGeneralSettingsArea(false)}
              className="text-gray-400 text-2xl cursor-pointer hover:text-gray-200"
            />
          </div>
          {channelGeneralSettings === "overview" && (
            <>
              <div className="flex  p-6">
                <div className="relative group flex ">
                  {singleChannel?.channelPic ? (
                    <img
                      className="w-32 h-32 rounded-full border-4 shadow-lg border-gray-600  transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-xl"
                      src={`http://localhost:5000${singleChannel?.channelPic}`}
                      alt="Channel"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-md transform transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:shadow-xl">
                      <p className="text-black font-bold text-2xl">
                        {initials}
                      </p>
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

                <div className="text-xs w-48 p-4 text-gray-400">
                  <p>
                    We recommended an image of at least 512x512 for the channel
                  </p>
                  <p className="pt-5">
                    Click to the image for change channel picture
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-[#A9B6C1] text-sm">SERVER NAME</p>
                  <input
                    className="w-52 h-10 bg-[#1E1F22] outline-none text-white px-2"
                    placeholder={singleChannel?.channelName}
                    type="text"
                  />
                </div>
              </div>

              <div className="p-6 space-y-4">
                <button
                  onClick={() => getLink()}
                  className={`w-full h-12 px-4 bg-gray-700 ${
                    isSucces && "bg-green-500 hover:bg-green-600"
                  } text-white font-medium rounded-md hover:bg-gray-600 transition-all duration-300 ease-in-out shadow-md`}
                >
                  {isSucces ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="w-5 h-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Link copied
                    </span>
                  ) : (
                    "Get Link"
                  )}
                </button>
                <button
                  onClick={() => setOpenDeleteArea(!openDeleteArea)}
                  className="w-full h-12 px-4 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 transition-all duration-300 ease-in-out shadow-md"
                >
                  Delete Channel
                </button>
              </div>
            </>
          )}

          {channelGeneralSettings === "members" && (
            <div className="w-full h-auto p-5 flex flex-col gap-2 rounded-md overflow-y-auto custom-scrollbar ">
              {singleChannel?.channelUsers.map((member: Member) => (
                <div
                  key={member._id}
                  className="w-full flex items-center gap-4 p-3 justify-between  rounded-lg  transition-shadow"
                >
                  <div className="flex gap-2 items-center">
                    <img
                      className="w-12 h-12 rounded-full object-cover  "
                      src={`http://localhost:5000${member.profilePic}`}
                      alt={`${member.username}'s profile`}
                    />
                    <div className="flex flex-col">
                      <p className="text-base font-semibold text-white">
                        {member.username}
                      </p>
                      <p className="text-sm text-gray-500">Member</p>
                    </div>
                  </div>

                  {
                    !singleChannel.admin.includes(member._id) &&
                    <div onClick={()=>kickUserFromChannel(member._id)} className="flex flex-col items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded-lg shadow-md transition-all cursor-pointer">
                    <p className="text-sm font-medium">Kick User</p>
                  </div>
                  }
                </div>
              ))}
            </div>
          )}

          {channelGeneralSettings === "roles" && (
            <div className="w-full h-auto  rounded-lg  p-6">
              {/* Section Title */}
              <div className="w-full text-gray-400 mb-4">
                <p className="text-sm">
                  Use roles to group your server members and assign permissions.
                </p>
              </div>

              <div className="w-full flex p-4 gap-4">
                <div className="relative flex-1">
                  <input
                    className="w-full h-12 bg-[#1E1F22] outline-none rounded-md px-4 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Search role"
                    type="text"
                  />
                  <CiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400 cursor-pointer hover:text-gray-200" />
                </div>
                <button className="bg-[#5865F2] w-32 h-12 rounded-md text-sm font-medium text-white hover:bg-[#4a55c1] transition-all duration-200">
                  Create Role
                </button>
              </div>

              <div className="w-full flex justify-between px-5 pt-6 pb-2 text-xs text-gray-500 border-b border-gray-600">
                <span className="font-semibold">ROLES</span>
                <span className="font-semibold">MEMBERS</span>
              </div>

              <div className="w-full">
                <div className="w-full px-5 py-4 flex justify-between text-sm font-semibold text-red-500 bg-[#292B2F] rounded-md mt-4 shadow">
                  <span>ADMIN</span>
                  <p>{singleChannel?.admin.length}</p>
                </div>
                <div className="w-full px-5 py-4 flex justify-between text-sm font-semibold text-blue-500 bg-[#292B2F] rounded-md mt-4 shadow">
                  <span>DEFAULT</span>
                  <p>{singleChannel?.channelUsers.length}</p>
                </div>
              </div>
            </div>
          )}
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
