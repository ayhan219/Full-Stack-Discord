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
  const {
    user,
    activeMenu,
    setActiveMenu,
    onlineFriendUserIds,
    onlineFriends,
    setChattingFriend
  } = useUserContext();
  const [activeTopBarMenu, setActiveTopBarMenu] = useState<string>("online");

  const show = () => {
    console.log(onlineFriends);
  };

  useEffect(()=>{
    setChattingFriend("");
  },[])

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
                <h3 onClick={() => show()}>ONLINE - {onlineFriends.length}</h3>
              </div>
              <div className="w-full h-[calc(100%-60px)] p-4 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                {user?.friends && user?.friends.length > 0 ? (
                  onlineFriends.length > 0 ? (
                    onlineFriends.map((item, index) => (
                      <HomeFriend
                        key={index}
                        item={item}
                        activeTopBarMenu={activeTopBarMenu}
                      />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <div className="text-gray-300 p-8 rounded-lg  max-w-md text-center">
                        <div className="flex flex-col items-center">
                          <div className=" p-4 rounded-full mb-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-gray-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 11c0-1.5 0-4-2-4s-2 2.5-2 4c0 1.5.5 2 2 2s2-.5 2-2zm4 4v1c0 1.5-.5 2-2 2H8c-1.5 0-2-.5-2-2v-1c0-2.5 1.5-4 4-4h4c2.5 0 4 1.5 4 4z"
                              />
                            </svg>
                          </div>
                          <h2 className="text-2xl font-bold mb-2">
                            No Online Friends
                          </h2>
                          <p className="text-sm text-gray-400 mb-4">
                            None of your friends are online right now. Take a
                            moment to relax or check back later!
                          </p>
                         
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500 font-medium text-xl">
                    <p>You don't have online friends yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTopBarMenu === "all" && (
            <div className="w-full h-[calc(100%-60px)] p-4  overflow-y-auto  custom-scrollbar flex flex-col gap-2 ">
              {activeMenu === "friends" &&
                (user?.friends && user?.friends.length > 0 ? (
                  user?.friends.map((item, index) => (
                    <HomeFriend
                      key={index}
                      item={item}
                      activeTopBarMenu={activeTopBarMenu}
                    />
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full text-gray-500 font-medium text-xl">
                    <p>You don't have any friends yet</p>
                  </div>
                ))}
            </div>
          )}
          {activeTopBarMenu === "addfriend" && <AddFriendMenu />}
          {activeTopBarMenu === "pending" && (
            <>
              <div className="w-full h-full bg-[#313338] p-3">
                <div className="w-full h-auto text-gray-400 px-7 py-3 font-bold ">
                  <h3>Pending - {user?.pendingFriend.length}</h3>
                </div>
                <div className="w-full h-[calc(100%-60px)] p-3  overflow-y-auto  custom-scrollbar ">
                  {user?.pendingFriend.map((item, index) => (
                    <PendingFriend key={index} item={item} />
                  ))}
                  {user?.pendingFriend?.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-gray-500 bg-[#2B2D31] p-6 rounded-lg shadow-md">
                      <div className="text-4xl mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75a3 3 0 116 0 3 3 0 01-6 0zm0 0v-.75A6 6 0 1112 21a6 6 0 01-6-6v-.75"
                          />
                        </svg>
                      </div>
                      <p className="text-lg font-semibold">
                        You have no pending friend requests.
                      </p>
                      <p className="text-sm mt-1">
                        Send friend requests or wait for others to send you one!
                      </p>
                    </div>
                  )}
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
