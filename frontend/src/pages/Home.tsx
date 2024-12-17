import HomeFriend from "../components/HomeFriend";
import Menu from "../components/Menu";
import TopBar from "../components/TopBar";
import { IoMdSearch } from "react-icons/io";
import "../index.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import FriendChat from "../components/FriendChat";

const Home = () => {
  const { user } = useUserContext();

  const [activeMenu, setActiveMenu] = useState<string>("friends");
  const [openChat, setOpenChat] = useState<boolean>(false);

  return (
    <div className="w-full h-screen flex bg-[#313338]">
      <Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="w-[70%] flex flex-col ">
        <TopBar />
        <div className="w-full border-r  border-x-gray-600 h-[88%]">
          <div className="w-full h-12 flex  items-center  relative ">
            <div className="w-full h-[70%] relative flex justify-center">
              <input
                className="w-[95%] h-full bg-[#1E1F22] rounded-lg pl-2 outline-none text-white"
                placeholder="Search"
                type="text"
              />
              <IoMdSearch className="absolute text-2xl text-gray-400 right-6 bottom-1 mr-1" />
            </div>
          </div>

          {activeMenu === "friends" && (
            <div className="w-full h-auto text-gray-400 px-7 py-3 font-bold ">
              <h3>ONLINE - {user?.friends.length}</h3>
            </div>
          )}
          <div className="w-full h-[calc(100%-60px)] p-3  overflow-y-auto  custom-scrollbar ">
            {activeMenu === "friends" &&
              ( user?.friends && user?.friends.length > 0 ? (
                user?.friends.map((item, index) => (
                  <HomeFriend
                    key={index}
                    item={item}
                    openChat={openChat}
                    setOpenChat={setOpenChat}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500 font-medium text-xl">
                  <p>You don't have any friends yet</p>
                </div>
              ))}
            {activeMenu === "nitro" && (
              <div className="flex justify-center items-center h-full text-gray-500 font-medium text-xl">
                <p>Nitro area</p>
              </div>
            )}
            {activeMenu === "message" && (
              <div className="flex justify-center items-center h-full text-gray-500 font-medium text-xl">
                <p>message area</p>
              </div>
            )}
            {activeMenu === "shop" && (
              <div className="flex justify-center items-center h-full text-gray-500 font-medium text-xl">
                <p>shop area</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-[270px]"></div>
    </div>
  );
};

export default Home;
