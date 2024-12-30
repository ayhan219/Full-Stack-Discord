import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useState } from "react";

interface Message {
  senderId?: string;
  receiverId: string | null;
  message: string;
  time: string;
}

interface PrivateChatProps {
  item: Message;
}

interface Channel {
  _id: string;
  channelName: string;
}

const PrivateChat = ({ item }: PrivateChatProps) => {
  const { user, setChannels, getSingleChannel, singleChannel } =
    useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenForInv, setTokenForInv] = useState<string>("");
  const [channelURL, setChannelURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const isOwnMessage = item.senderId === user?.userId;

  const initials = singleChannel?.channelName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const saveURLPart = async (part: string) => {
    setIsModalOpen(true);
    setTokenForInv(part.split("/")[5]);
    setChannelURL(part.split("/")[4]);
    setLoading(true);
    try {
      await getSingleChannel(part.split("/")[4]);
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
        `http://localhost:5000/api/channel/join/${tokenForInv}`,
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
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

      {/* Modal - Kanal katılımı onayı */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#2F3136] p-6 rounded-lg shadow-lg w-[400px]">
            <div className="flex items-center justify-center mb-4">
              {/* Profile Image */}
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center cursor-pointer">
                <span className="text-lg font-semibold text-[#2F3136]">
                  {initials}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center">
                <div className="loader">Loading...</div>
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

                <p className="mt-4 text-white">
                  Do you want to join this channel?
                </p>

                {!loading ? (
                  <div className="mt-4 flex gap-4">
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
