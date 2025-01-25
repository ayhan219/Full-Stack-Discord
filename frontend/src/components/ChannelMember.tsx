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
    <div className="flex items-center gap-4 p-2 px-4 rounded-md hover:bg-gray-700 hover:text-white cursor-pointer transition-all">
      {/* Avatar Container */}
      <div className="relative">
        <img
          className="w-10 h-10 rounded-full"
          src={`http://localhost:5000${item.profilePic}`}
          alt="Avatar"
        />
        <div
          className="w-5 h-5 rounded-full bg-gray-700 border-2 border-gray-800 absolute right-0 bottom-[-4px] flex items-center justify-center"
          title="Online"
        >
          {onlineChannelUsers.some((user) => user._id === item._id) && (
            <div className="w-3 h-3 rounded-full bg-green-600  "></div>
          )}
        </div>
        {singleChannel?.admin?.includes(item._id) && (
          <div className="absolute -top-5 left-2 text-3xl text-yellow-500">
            <FaCrown />
          </div>
        )}
      </div>

      {/* Username */}
      <h3 className="text-base font-medium text-gray-400">{item.username}</h3>
    </div>
  );
};

export default ChannelMember;
