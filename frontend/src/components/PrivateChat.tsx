
import { useUserContext } from "../context/UserContext"; 

interface Message {
  senderId?:string,
  receiverId:string | null,
  message:string,
  time:string
}

interface PrivateChatProps {
  item: Message;
}

const PrivateChat = ({ item }: PrivateChatProps) => {
  const { user } = useUserContext();

  const isOwnMessage = item.senderId === user?.userId;


  const parseMessage = (message: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700"
        >
          {part}
        </a>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };
  

  return (
    <div
      className={`flex items-center gap-3 mb-4 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwnMessage && (
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={`http://localhost:5000${localStorage.getItem("profilePic")}`}
          alt="Sender"
        />
      )}

      <div className={`flex flex-col ${isOwnMessage ? "items-end" : ""}`}>
        {!isOwnMessage && (
          <div>
            <p>{localStorage.getItem("username")}</p>
          </div>
        )}
        <div
          className={`bg-[#40444B] text-white p-3 rounded-lg max-w-xs ${
            isOwnMessage ? "ml-2" : "mr-2"
          }`}
        >
           <p>{parseMessage(item.message)}</p>
        </div>
        <span className="text-xs text-gray-500 mt-1">{item.time} PM</span>
      </div>

      {isOwnMessage && (
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={`http://localhost:5000${user?.profilePic}`}
          alt="Sender"
        />
      )}
    </div>
  );
};

export default PrivateChat;
