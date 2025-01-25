import { useUserContext } from "../context/UserContext";
import ChannelMember from "./ChannelMember";

type ChannelProps = {
  onlineChannelUsers: {
    _id: string;
    username: string;
    profilePic: string;
  }[];
};

const ChatRightArea = ({ onlineChannelUsers }: ChannelProps) => {
  const { singleChannel, loading } = useUserContext();


  return (
    <div className="w-[300px] h-full bg-[#2B2D31] shadow-lg rounded-lg overflow-hidden">
  {loading ? (
    <div className="flex items-center justify-center w-full h-full">
      <span className="text-gray-400 text-lg animate-pulse">Loading...</span>
    </div>
  ) : (
    <>
      {/* Members Section */}
      <div className="p-4">
        <h3
          className="text-gray-300 text-lg font-bold cursor-pointer hover:text-white transition">
          Members - {singleChannel?.channelUsers.length}
        </h3>
      </div>

      {/* Online Members */}
      <div className="p-4">
        <h4 className="text-gray-400 text-sm font-medium mb-2">Online</h4>
        <div className="space-y-3">
          {onlineChannelUsers.map((item, index) => (
            <ChannelMember
              key={index}
              item={item}
              onlineChannelUsers={onlineChannelUsers}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-600 mx-4" />

      {/* Offline Members */}
      <div className="p-4">
        <h4 className="text-gray-400 text-sm font-medium mb-2">Offline</h4>
        <div className="space-y-3  opacity-45">
          {singleChannel?.channelUsers.map(
            (item:any, index) =>
              !onlineChannelUsers.some((user) => user._id === item._id) && (
                <ChannelMember
                  key={index}
                  item={item}
                  onlineChannelUsers={onlineChannelUsers}
                />
              )
          )}
        </div>
      </div>
    </>
  )}
</div>

  );
};

export default ChatRightArea;
