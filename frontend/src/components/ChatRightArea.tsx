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

  const show = () => {
    console.log(onlineChannelUsers);
  };

  return (
    <div className="w-[270px] h-full bg-[#2B2D31]">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full"></div>
      ) : (
        <>
          <div className="w-full h-10 text-gray-400 p-4 text-xl font-semibold">
            <h3 onClick={() => show()}>
              Members - {singleChannel?.channelUsers.length}
            </h3>
          </div>
          <div className="w-full h-auto pt-3">
            {/* {
              singleChannel?.channelUsers.map((item,index)=>(
                <ChannelMember key={index} item={item} />
              ))
            } */}
            {onlineChannelUsers.map((item, index) => (
              <ChannelMember
                key={index}
                item={item}
                onlineChannelUsers={onlineChannelUsers}
              />
            ))}
          </div>
          <div className="w-full h-auto">
            <div className="w-full h-10 text-gray-400 p-4 text-xl font-semibold">
              <h3>Offline</h3>
            </div>
            {singleChannel?.channelUsers.map(
              (item: any, index) =>
                !onlineChannelUsers.some((user) => user._id === item._id) && (
                  <ChannelMember
                    key={index}
                    item={item}
                    onlineChannelUsers={onlineChannelUsers}
                  />
                )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatRightArea;
