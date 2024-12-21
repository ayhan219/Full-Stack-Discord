import HomeFriend from "../components/HomeFriend";
import Menu from "../components/Menu";
import TopBar from "../components/TopBar";
import { IoMdSearch } from "react-icons/io";
import "../index.css";
import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import AddFriendMenu from "../components/AddFriendMenu";
import PendingFriend from "../components/PendingFriend";


const Home = () => {
  const { user, activeMenu, setActiveMenu } = useUserContext();
  const [activeTopBarMenu, setActiveTopBarMenu] = useState<string>("online");


  const show = ()=>{
    console.log(user);
    
  }
  
  return (
    <div className="w-full h-screen flex bg-[#313338]">
      <Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      {activeMenu === "friends" && (
        <div className="w-[70%] flex flex-col ">
          <TopBar
            activeTopBarMenu={activeTopBarMenu}
            setActiveTopBarMenu={setActiveTopBarMenu}
          />
          {activeTopBarMenu === "online" && (
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

              <div className="w-full h-auto text-gray-400 px-7 py-3 font-bold ">
                <h3 onClick={()=>show()}>ONLINE - {user?.friends.length}</h3>
              </div>
              <div className="w-full h-[calc(100%-60px)] p-3  overflow-y-auto  custom-scrollbar ">
                {activeMenu === "friends" &&
                  (user?.friends && user?.friends.length > 0 ? (
                    user?.friends.map((item, index) => (
                      <HomeFriend key={index} item={item} />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-full text-gray-500 font-medium text-xl">
                      <p>You don't have any friends yet</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
          {activeTopBarMenu === "addfriend" && <AddFriendMenu />}
          {activeTopBarMenu === "pending" && (
            <>
              <div className="w-full h-full bg-[#313338] p-3">
                <div className="w-full h-auto text-gray-400 px-7 py-3 font-bold ">
                  <h3>Pending - {user?.pendingFriend.length}</h3>
                </div>
                <div  className="w-full h-[calc(100%-60px)] p-3  overflow-y-auto  custom-scrollbar ">
                 {
                  user?.pendingFriend.map((item,index)=>(
                    <PendingFriend key={index} item={item} />
                  ))
                 }
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
