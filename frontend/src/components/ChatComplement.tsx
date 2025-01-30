import { useUserContext } from "../context/UserContext";

interface ChatComplementProps {
  item: {
    channelName: string;
    message: string;
    serverName: string;
    username: string;
    profilePic: string;
    time: string;
    userId: string;
    image: string;
  };
}

const ChatComplement = ({ item }: ChatComplementProps) => {
  const { user, singleChannel } = useUserContext();

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex items-center `}>
      <img
        className="w-10 h-10 rounded-full object-cover border border-gray-500"
        src={`http://localhost:5000${item.profilePic}`}
        alt="Avatar"
      />

      <div className={`max-w-xs p-2 rounded-lg `}>
        <div className="flex items-center gap-2">
          {
            <h3
              className={`font-medium text-base  ${
                singleChannel?.admin.includes(item.userId) && "text-red-500"
              }`}
            >
              {item.username}
            </h3>
          }
          <p className="text-xs text-gray-400">{formatTime(item.time)}</p>
        </div>
        {item.image ? (
          <img src={item.image} alt="sent" className="w-40 h-auto rounded-lg" />
        ) : (
          <p className="font-normal text-sm">{item.message}</p>
        )}
      </div>
    </div>
  );
};

export default ChatComplement;
