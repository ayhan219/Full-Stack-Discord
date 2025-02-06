import { useUserContext } from "../context/UserContext";

interface ChatComplementProps {
  item: {
    channelId: string;
  chatName:string,
  message: string;
  username: string;
  profilePic: string;
  time: string;
  senderId: string | {_id:string,username:string,profilePic:string};
  isImage: boolean;
  };
}

const ChatComplement = ({ item }: ChatComplementProps) => {
  const {singleChannel,url } = useUserContext();

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex items-center `}>
      <img
        className="w-10 h-10 rounded-full object-cover border border-gray-500"
        src={`${typeof item.senderId ==="string" ? `${url}${item.profilePic}` :`${url}${item.senderId.profilePic}`}`}
        alt="Avatar"
      />

      <div className={`max-w-xs p-2 rounded-lg `}>
        <div className="flex items-center gap-2">
          {
            <h3
            className={`font-medium text-sm ${
              singleChannel?.admin.includes(typeof item.senderId === "string" ? item.senderId : item.senderId._id) 
                ? "text-red-500" 
                : "text-gray-400"
            }`}
          >
            {typeof item.senderId ==="string" ? item.username : item.senderId.username}
          </h3>
          }
          <p className="text-xs text-gray-400">{typeof item.senderId==="string" ? formatTime(item.time): item.time }</p>
        </div>
        {item.isImage? (
          <img src={item.message} alt="sent" className="w-40 h-auto rounded-lg" />
        ) : (
          <p className="font-normal text-sm">{item.message}</p>
        )}
      </div>
    </div>
  );
};

export default ChatComplement;
