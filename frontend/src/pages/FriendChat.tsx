import Menu from "../components/Menu";
import { useUserContext } from "../context/UserContext";
import { FaPhoneAlt } from "react-icons/fa";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { SiPinboard } from "react-icons/si";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { CiSearch } from "react-icons/ci";
import PrivateChat from "../components/PrivateChat";

const FriendChat = () => {
  const { activeMenu, setActiveMenu } = useUserContext();

  return (
    <div className="w-full h-screen flex bg-[#313338]">
      <Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex flex-col w-[calc(100%-270px)] h-full bg-[#2F3136]">
        {/* Top Bar */}
        <div className="w-full h-16 bg-[#292B2F] flex justify-between items-center px-4 border-b border-gray-700">
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://sabalawfirm.org/wp-content/uploads/2022/05/default-profile.png"
              alt="Profile"
            />
            <h3 className="text-white font-semibold text-lg">Username</h3>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-4 text-gray-300">
            <FaPhoneAlt className="text-xl cursor-pointer hover:text-white transition duration-200" />
            <BsFillCameraVideoFill className="text-xl cursor-pointer hover:text-white transition duration-200" />
            <SiPinboard className="text-xl cursor-pointer hover:text-white transition duration-200" />
            <LiaUserFriendsSolid className="text-xl cursor-pointer hover:text-white transition duration-200" />

            {/* Search Bar */}
            <div className="relative flex items-center">
              <input
                className="w-40 h-8 bg-[#202225] text-sm text-white rounded-lg pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
                type="text"
              />
              <CiSearch className="absolute right-2 text-gray-400 text-lg pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-[#2F3136] text-gray-400 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4">
            
           
            <PrivateChat />
            <PrivateChat />
            <PrivateChat />
            <PrivateChat />
            
          </div>

          {/* Message Input Section */}
          <div className="w-full p-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <input
                className="w-full bg-[#40444B] text-white rounded-lg p-3 focus:outline-none focus:ring-2"
                placeholder="Type a message..."
                type="text"
              />
              <button className="text-blue-500">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendChat;
