
import { IoChatbubble } from "react-icons/io5";

const HomeFriend = () => {
  return (
    <div className="w-full h-auto text-gray-400 font-semibold flex p-2 px-5 items-center border-t border-gray-600 justify-between hover:bg-gray-500 cursor-pointer hover:rounded-lg ">
      <div className="flex justify-center items-center gap-5">
      <div className="relative">
        <img
          src="https://m.media-amazon.com/images/I/61GU80tkXwL._AC_UF894,1000_QL80_.jpg"
          className="w-10 h-10 rounded-full"
        />
        <div className="w-3 h-3 rounded-full bg-green-700 absolute right-0 bottom-0"></div>
      </div>
      <h3 className="text-base text-white ">Ayhan</h3>
      </div>
      
      <div className="w-20 h-16 flex items-center justify-center">
        <div className="w-11 h-11 rounded-full bg-[#1E1F22] flex items-center justify-center">
            <IoChatbubble className="text-gray-400 text-xl cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default HomeFriend;
