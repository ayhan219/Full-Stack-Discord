import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useState } from "react";

interface Message {
  senderId?: string;
  receiverId: string | null;
  message: string;
  time: string;
  isImage:boolean
}

interface PrivateChatProps {
  item: Message;
}

interface Channel {
  _id: string;
  channelName: string;
}

const PrivateChat = ({ item }: PrivateChatProps) => {
  const { user, setChannels, getSingleChannel, singleChannel, socket,url } =
    useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenForInv, setTokenForInv] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);


  const initials = singleChannel?.channelName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const saveURLPart = async (part: string) => {
    setIsModalOpen(true);
    setTokenForInv(part.split("/")[5]);
    setLoading(true);
    try {
      getSingleChannel(part.split("/")[4]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching channel:", error);
      setLoading(false);
    }
  };

  const parseMessage = (message: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? (
        <a
          key={index}
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700"
          onClick={() => saveURLPart(part)}
        >
          {part}
        </a>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const handleJoinChannel = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/channel/join/${tokenForInv}`,
        {
          params: {
            userId: user?.userId,
          },
        }
      );
      if (response.status === 200) {     
        setChannels((prev: Channel[]) => {
          return [...prev, response.data];
        });
        setIsModalOpen(false);
        socket.emit("joinServer", {
          serverName:singleChannel?.channelName, userId:user?.userId ,username:user?.username,profilePic:user?.profilePic
        });
        

      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isOwnUser = user?.userId === item.senderId



  return (
    <div className={`flex items-start gap-4 mb-4`}>
  <img
    className="w-10 h-10 rounded-full object-cover"
    src={isOwnUser ? `${url}${user?.profilePic}` : `${url}${localStorage.getItem("profilePic")}`}
    alt="Sender"
  />

  <div className={`flex flex-col w-full`}>
    <div className="flex items-center gap-2 mb-1">
      <p className="font-semibold text-gray-200">{isOwnUser ? user?.username : localStorage.getItem("username")}</p>
      <span className="text-xs text-gray-400 mt-1">{item.time}</span>
    </div>

    <div
      className={`rounded-lg max-w-lg text-white  relative`}
      style={{
        wordWrap: "break-word",
        whiteSpace: "pre-wrap",
        overflowWrap: "break-word",
      }}
    >
      {
        !item.isImage ? 
        <p className="text-sm text-[#A6A9AC]">{parseMessage(item.message)}</p> :
        <img src={item.message} alt="sent" className="w-40 h-auto rounded-lg" />
      }
    </div>

   
  </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
          <div className="bg-[#2F3136] p-6 rounded-lg shadow-lg w-[400px]">
            <div className="flex items-center justify-center mb-6 gap-6">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg cursor-pointer transition-transform transform hover:scale-105">
                <span className="text-2xl font-bold text-white">
                  {initials}
                </span>
              </div>

              <div className="text-white font-bold text-lg text-center">
                <p className="text-2xl leading-none">
                  {singleChannel?.channelUsers.length} User
                </p>
                <p className="text-sm font-normal text-gray-300">
                  Active in this channel
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center">
                <div className="flex space-x-1 text-lg font-bold text-gray-700">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-200">.</span>
                  <span className="animate-bounce delay-400">.</span>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-white">
                  A user invited you to join a channel!
                </h2>
                <p className="mt-2 text-white">
                  You've been invited to join the following channel:
                </p>

                <div className="mt-4 bg-[#3A3D42] p-4 rounded-md">
                  <h3 className="text-lg font-medium text-blue-400">
                    Channel Name: {singleChannel?.channelName}
                  </h3>
                  <p className="text-sm text-gray-300">
                    This is the place for all the latest updates and
                    discussions!
                  </p>
                </div>

                <p className="mt-4 text-white text-center">
                  Do you want to join this channel?
                </p>

                {!loading ? (
                  <div className="mt-4 flex gap-6 justify-center">
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded"
                      onClick={() => handleJoinChannel()}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-red-500 text-white py-2 px-4 rounded"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <div className="loader">Loading...</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivateChat;
