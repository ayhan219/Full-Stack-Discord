
import { useUserContext } from "../context/UserContext"; 

interface Message {
  senderId: string;
  username: string;
  receiverId: string;
  profilePic: string;
  message: string;
  time: string;
}

interface PrivateChatProps {
  item: Message;
}

const PrivateChat = ({ item }: PrivateChatProps) => {
  const { user } = useUserContext();

  const isOwnMessage = item.senderId === user?.userId;

  return (
    <div
      className={`flex items-center gap-3 mb-4 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwnMessage && (
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={`http://localhost:5000${item.profilePic}`}
          alt="Sender"
        />
      )}

      <div className={`flex flex-col ${isOwnMessage ? "items-end" : ""}`}>
        {!isOwnMessage && (
          <div>
            <p>{item.username}</p>
          </div>
        )}
        <div
          className={`bg-[#40444B] text-white p-3 rounded-lg max-w-xs ${
            isOwnMessage ? "ml-2" : "mr-2"
          }`}
        >
          <p>{item.message}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">{item.time} PM</span>
      </div>

      {isOwnMessage && (
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={`http://localhost:5000${item.profilePic}`}
          alt="Sender"
        />
      )}
    </div>
  );
};

export default PrivateChat;
