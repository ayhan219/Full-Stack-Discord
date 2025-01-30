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
  const { user, singleChannel } = useUserContext();
  return (
    <div className="flex items-center gap-4 p-2 px-3 rounded-md hover:bg-gray-700  cursor-pointer transition-all">
      {/* Avatar Container */}
      <div className="relative">
        <img
          className="w-9 h-9 rounded-full"
          src={`http://localhost:5000${item.profilePic}`}
          alt="Avatar"
        />
        {
          onlineChannelUsers.some((user)=>user._id === item._id) &&
          <div
          className="w-4 h-4 rounded-full bg-gray-700 border-2 border-gray-800 absolute -right-[0.10rem] bottom-[-4px] flex items-center justify-center"
          title="Online"
        >
          
            <div className="w-3 h-3 rounded-full bg-green-500  "></div>
        </div>
        }
        {singleChannel?.admin?.includes(item._id) && (
          <div className="absolute -top-5 left-2 text-3xl text-yellow-500">
            <FaCrown />
          </div>
        )}
      </div>

      {/* Username */}
      <h3 className={`text-base font-semibold ${singleChannel?.admin.includes(item._id) ? "text-red-500 font-bold" : "text-gray-400"}  `}>{item.username}</h3>
    </div>
  );
};

export default ChannelMember;
