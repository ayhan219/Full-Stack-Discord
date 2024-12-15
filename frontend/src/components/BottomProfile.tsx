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

const BottomProfile = () => {
  const [turnMicOff, setTurnMicOff] = useState<boolean>(false);
  const [turnHeadOff, setTurnHeadOff] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const {setUser} = useUserContext();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/auth/logout",
        {
          withCredentials: true,
        }
      );
      if ((response.status = 200)) {
        setUser(null);
        navigate("/login");
        
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-16 bg-[#232428] mt-auto p-3 relative">
      <div className="w-full h-full flex ">
        <div className="flex w-full gap-3">
          <div className="w-[20%] h-full flex justify-center">
            <img
              className="w-10 h-10 rounded-full"
              src="https://i.pinimg.com/1200x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg"
              alt=""
            />
          </div>
          <div className="text-white w-auto max-w-12 flex items-center">
            <p>Ayhan</p>
          </div>
        </div>
        <div className="flex  text-white text-xl gap-3 items-center">
          {!turnMicOff ? (
            <FaMicrophone
              onClick={() => setTurnMicOff(!turnMicOff)}
              className="cursor-pointer"
            />
          ) : (
            <PiMicrophoneSlashFill
              onClick={() => setTurnMicOff(!turnMicOff)}
              className="cursor-pointer text-red-600"
            />
          )}
          {!turnHeadOff ? (
            <FaHeadphones
              onClick={() => setTurnHeadOff(!turnHeadOff)}
              className="cursor-pointer"
            />
          ) : (
            <TbHeadphonesOff
              onClick={() => setTurnHeadOff(!turnHeadOff)}
              className="cursor-pointer text-red-600"
            />
          )}
          <IoMdSettings
            onClick={() => setOpenSettings(!openSettings)}
            className="cursor-pointer"
          />
        </div>
      </div>
      {openSettings && (
        <div className="absolute w-full h-36 bg-[#1E1F22] bottom-16 right-0 shadow-lg rounded-lg flex flex-col justify-between">
          <div className="w-full h-12 bg-[#232428] rounded-t-lg flex items-center px-4">
            <h3 className="text-white text-lg font-semibold">
              Account Settings
            </h3>
          </div>
          <div className="flex-1 flex flex-col justify-center px-4">
            <button className="w-full py-2 bg-[#2B2D31] hover:bg-[#3A3C41] text-white font-medium rounded-md text-center transition duration-150 ease-in-out">
              Manage Account
            </button>
          </div>
          <div className="w-full h-12 bg-[#232428] rounded-b-lg flex items-center justify-between px-4">
            <h3 className="text-gray-400 font-semibold">Logout</h3>
            <IoLogOutSharp
              onClick={handleLogout}
              className="text-red-600 text-2xl cursor-pointer hover:scale-110 transition duration-150 ease-in-out"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomProfile;
