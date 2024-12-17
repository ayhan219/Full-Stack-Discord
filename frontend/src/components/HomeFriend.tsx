import { IoChatbubble } from "react-icons/io5";

type HomeFriendProps = {
  item: {
    username: string;
    _id: string;
  };
};

const HomeFriend = ({ item }: HomeFriendProps) => {
  return (
    <div className="w-full h-auto text-gray-300 font-semibold flex p-3 px-6 items-center border-t border-gray-600 justify-between hover:bg-gray-600 cursor-pointer hover:rounded-lg transition-all">
      <div className="flex justify-center items-center gap-4">
        <div className="relative">
          <img
            src="https://m.media-amazon.com/images/I/61GU80tkXwL._AC_UF894,1000_QL80_.jpg"
            alt={`${item.username}'s profile`}
            className="w-12 h-12 rounded-full object-cover border-2 border-gray-500"
          />
          <div className="w-3 h-3 rounded-full bg-green-500 absolute right-0 bottom-0 border-2 border-white"></div>
        </div>
        <h3 className="text-lg text-white font-medium">{item.username}</h3>
      </div>

      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#1E1F22] hover:bg-gray-500 transition-all">
        <IoChatbubble className="text-gray-300 text-2xl cursor-pointer hover:text-white" />
      </div>
    </div>
  );
};

export default HomeFriend;
