import { useUserContext } from "../context/UserContext";
import { FaCrown } from "react-icons/fa";

type ChannelMemberProps = {
  item: {
    _id: string;
    profilePic: string;
    username: string;
  };
  onlineChannelUsers: {
    _id: string;
    username: string;
    profilePic: string;
  }[];
};

const ChannelMember = ({ item, onlineChannelUsers }: ChannelMemberProps) => {
  const {singleChannel,url } = useUserContext();
  return (
    <div className="flex  items-center gap-2 md:gap-3 p-2 px-3 rounded-md hover:bg-gray-700  cursor-pointer transition-all">
      {/* Avatar Container */}
      <div className="relative">
        <img
          className="w-8 h-8 md:w-9 md:h-9 rounded-full"
          src={`${url}${item.profilePic}`}
          alt="Avatar"
        />
        {
          onlineChannelUsers.some((user)=>user._id === item._id) &&
          <div
          className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gray-700 border-2 border-gray-800 absolute -right-[0.10rem] bottom-[-2px] md:bottom-[-4px] flex items-center justify-center"
          title="Online"
        >
          
            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500  "></div>
        </div>
        }
        {singleChannel?.admin?.includes(item._id) && (
          <div className="absolute -top-5 left-2 text-xl md:text-3xl text-yellow-500">
            <FaCrown />
          </div>
        )}
      </div>

      {/* Username */}
      <h3 className={`text-sm md:text-base font-semibold ${singleChannel?.admin.includes(item._id) ? "text-red-500 font-bold" : "text-gray-400"}  `}>{item.username}</h3>
    </div>
  );
};

export default ChannelMember;
