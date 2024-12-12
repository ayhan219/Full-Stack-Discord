import HomeFriend from "../components/HomeFriend";
import Menu from "../components/Menu";
import TopBar from "../components/TopBar";
import { IoMdSearch } from "react-icons/io";

const Home = () => {
  return (
    <div className="w-full flex bg-[#313338]">
      <Menu />
      <div className="flex flex-col w-full">
        <TopBar />
        <div className="w-[80%] border-r  border-x-gray-600 h-[88%]">
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
          <div className="w-full h-full">
            <div className="w-full h-auto text-gray-400 px-7 py-3 font-bold ">
              <h3>ONLINE - 2</h3>
            </div>
            <div className="w-full h-auto p-3">
              <HomeFriend />
              <HomeFriend />
              <HomeFriend />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
