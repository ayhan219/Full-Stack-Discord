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
  };
}

const ChatComplement = ({ item }: ChatComplementProps) => {
  const { user } = useUserContext();

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isUserMessage = item.userId === user?.userId;

  return (
    <div
      className={`flex items-start gap-4 ${
        isUserMessage ? "justify-end text-right" : "justify-start text-left"
      }`}
    >
      {!isUserMessage && (
        <img
          className="w-10 h-10 rounded-full object-cover border border-gray-500"
          src={`http://localhost:5000${item.profilePic}`}
          alt="Avatar"
        />
      )}
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isUserMessage
            ? "bg-gray-600 text-white self-end"
            : "bg-gray-600 text-gray-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{item.username}</h3>
          <p className="text-xs text-gray-400">{formatTime(item.time)}</p>
        </div>
        <p className="text-sm">{item.message}</p>
      </div>
      {isUserMessage && (
        <img
          className="w-10 h-10 rounded-full object-cover border border-gray-500"
          src={`http://localhost:5000${item.profilePic}`}
          alt="Avatar"
        />
      )}
    </div>
  );
};

export default ChatComplement;
