import { FaMicrophone } from "react-icons/fa";
import { PiMicrophoneSlashFill } from "react-icons/pi";
import { FaHeadphones } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbHeadphonesOff } from "react-icons/tb";
import { useState } from "react";
import { IoLogOutSharp } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useRoomContext } from "@livekit/components-react";

const BottomProfile = () => {
  const { user, socket } = useUserContext();
  const { turnMicOff, setTurnMicOff, turnHeadOff, setTurnHeadOff } =
    useUserContext();
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const { setUser } = useUserContext();
  const navigate = useNavigate();

  const room = useRoomContext();

  const handleLogout = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/auth/logout",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const userIds = user?.friends.map((friend: any) => friend);
        console.log(userIds);

        socket.emit("userDisconnected", {
          userIds: userIds,
          senderId: user?.userId,
        });
        setUser(null);

        
        window.location.reload();
        navigate("/login");
        socket.disconnect();
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-16 bg-[#232428] p-3 relative">
      <div className="w-full h-full flex justify-between items-center">
        <div className="flex gap-3 items-center relative">
          <img
            className="w-7 h-7 md:w-10 md:h-10 rounded-full border-2 border-gray-600"
            src={`http://localhost:5000${user?.profilePic}`}
            alt="user-avatar"
          />
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-700 absolute left-5 bottom-[0.15rem] md:left-7 md:bottom-0 "></div>
          <div>
          <p className="text-white text-xs md:text-base font-medium">{user?.username}</p>
          <p className="text-xs  text-green-500">online</p>
          </div>
        </div>

        <div className="flex text-white text-xs md:text-base gap-2 md:gap-4 items-center">
          {/* Microphone Button */}
          <div
            onClick={() => {
              setTurnMicOff(!turnMicOff);
            }}
            className={`cursor-pointer transition duration-200 ${
              turnMicOff ? "text-red-600" : ""
            }`}
          >
            {turnMicOff ? (
              <PiMicrophoneSlashFill
                onClick={() => {
                  const audioTracks = Array.from(
                    room.localParticipant.audioTrackPublications.values()
                  );
                  audioTracks.forEach((trackPublication) => {
                    if (trackPublication.track) {
                      trackPublication.track.unmute();
                    }
                  });
                }}
              />
            ) : (
              <FaMicrophone
                onClick={() => {
                  const audioTracks = Array.from(
                    room.localParticipant.audioTrackPublications.values()
                  );
                  audioTracks.forEach((trackPublication) => {
                    if (trackPublication.track) {
                      trackPublication.track.mute();
                    }
                  });
                }}
              />
            )}
          </div>

          {/* Headphones Button */}
          <div
            onClick={() => setTurnHeadOff(!turnHeadOff)}
            className={`cursor-pointer transition duration-200 ${
              turnHeadOff ? "text-red-600" : ""
            }`}
          >
            {turnHeadOff ? (
              <TbHeadphonesOff
                onClick={() => {
                  const audioTracks = Array.from(
                    room.localParticipant.audioTrackPublications.values()
                  );

                  audioTracks.forEach((trackPublication) => {
                    if (
                      trackPublication.track &&
                      trackPublication.track.mediaStreamTrack
                    ) {
                      trackPublication.resumeUpstream();
                    }
                  });
                }}
              />
            ) : (
              <FaHeadphones
                onClick={() => {
                  const audioTracks = Array.from(
                    room.localParticipant.audioTrackPublications.values()
                  );

                  audioTracks.forEach((trackPublication) => {
                    if (
                      trackPublication.track &&
                      trackPublication.track.mediaStreamTrack
                    ) {
                      trackPublication.pauseUpstream();
                    }
                  });
                }}
              />
            )}
          </div>

          {/* Settings Button */}
          <div
            onClick={() => setOpenSettings(!openSettings)}
            className="cursor-pointer transition duration-200 hover:text-gray-400"
          >
            <IoMdSettings />
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {openSettings && (
        <div className="absolute w-full h-40 bg-[#1E1F22] bottom-16 right-0 shadow-2xl rounded-lg flex flex-col">
          <div className="w-full h-12 bg-[#232428] rounded-t-lg flex items-center justify-between px-6">
            <h3 className="text-white text-lg font-semibold">
              Account Settings
            </h3>
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 py-3">
            <button
              onClick={() => navigate("/profile")}
              className="w-full py-3 bg-[#2B2D31] hover:bg-[#3A3C41] text-white font-semibold rounded-md text-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#5D5F63] focus:ring-offset-2"
            >
              Manage Account
            </button>
          </div>

          <div className="w-full h-14 bg-[#232428] rounded-b-lg flex items-center justify-between px-6 py-3">
            <h3 className="text-gray-400 font-semibold">Logout</h3>
            <IoLogOutSharp
              onClick={handleLogout}
              className="text-red-600 text-2xl cursor-pointer hover:scale-110 hover:text-red-800 transition-all duration-200 ease-in-out"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomProfile;
