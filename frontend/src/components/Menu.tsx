import { FaUserFriends } from "react-icons/fa";
import { IoLogoIonitron } from "react-icons/io";
import { FaEnvelope } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";

const Menu = () => {
  return (
    <div className="w-[20%] h-screen bg-[#2B2D31] flex flex-col">
      <div className="w-full h-16 flex justify-center items-center">
        <input
          className="bg-[#1E1F22] w-[80%] h-9 outline-none text-white text-sm pl-2 rounded-lg"
          placeholder="Find or start a conversation"
          type="text"
        />
      </div>
      <div className="w-full h-[20%] flex flex-col items-center gap-2 ">
        <div className="w-full h-12 text-gray-400 font-bold flex  gap-2 cursor-pointer">
          <div className="flex w-[70%] justify-evenly items-center">
            <FaUserFriends className="text-3xl" />
            <h2 className="w-20 text-base font-semibold">Friends</h2>
          </div>
        </div>

        <div className="w-full h-12 text-gray-400 font-bold flex  gap-2 cursor-pointer">
          <div className="flex w-[70%] justify-evenly items-center">
            <IoLogoIonitron className="text-3xl" />
            <h2 className="w-20 text-base font-semibold">Nitro</h2>
          </div>
        </div>

        <div className="w-full h-12 text-gray-400 font-bold flex  gap-2 cursor-pointer">
          <div className="flex w-[70%] justify-evenly items-center">
          <FaEnvelope className="text-3xl" />
          <h2 className="w-20 text-base ">Message Request</h2>
          </div>
        </div>

        <div className="w-full h-12 text-gray-400 font-bold flex  gap-2 cursor-pointer">
          <div className="flex w-[70%] justify-evenly items-center">
            <FaShop className="text-3xl" />
            <h2 className="w-20 text-base font-semibold ">Shop</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
