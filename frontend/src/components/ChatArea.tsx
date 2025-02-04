import { FaHashtag } from "react-icons/fa6";
import ChatComplement from "./ChatComplement";
import "../index.css";
import { useUserContext } from "../context/UserContext";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Message {
  channelName: string;
  message: string;
  serverName: string;
  username: string;
  profilePic: string;
  time: string;
  userId: string;
  isImage: boolean;
}

const ChatArea = () => {
  const {
    singleChannel,
    selectedChatRoom,
    setSelectedChatRoom,
    socket,
    user,
    loading,
    url
  } = useUserContext();
  const [containsMessage, setContainsMessage] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [loadingForChat, setLoadingForChat] = useState<boolean>(false);

  useEffect(() => {
    setContainsMessage(messages.length > 0);
  }, [messages]);

  const handleActiveRoom = () => {
    const activeChatRoom = singleChannel?.chatChannel.find(
      (item) => item.roomName === selectedChatRoom
    );

    if (activeChatRoom) {
      if (activeChatRoom.messages && activeChatRoom.messages.length > 0) {
        setContainsMessage(true);
        console.log(activeChatRoom.messages);
      } else {
        setContainsMessage(false);
      }
    } else {
      setContainsMessage(false);
    }
  };

  useEffect(() => {
    handleActiveRoom();
  }, [selectedChatRoom, singleChannel]);

  const handleSend = async () => {
    if (message.trim() !== "") {
      socket.emit("sendMessageToChat", {
        serverName: singleChannel?.channelName,
        channelName: selectedChatRoom,
        userId: user?.userId,
        username: user?.username,
        profilePic: user?.profilePic,
        message: message,
        isImage: false,
      });
      try {
            await axios.post(
          `${url}/api/message/savechannelmessage`,
          {
            chatName: selectedChatRoom,
            channelId: singleChannel?._id,
            senderId: user?.userId,
            message,
            time: new Date().toLocaleTimeString(),
            isImage: false,
          }
        );
      } catch (error) {
        console.log(error);
      }
      setMessage("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      socket.emit("sendMessageToChat", {
        serverName: singleChannel?.channelName,
        channelName: selectedChatRoom,
        userId: user?.userId,
        username: user?.username,
        profilePic: user?.profilePic,
        message: base64Image,
        isImage: true,
      });

      try {
        await axios.post(
          `${url}/api/message/savechannelmessage`,
          {
            chatName: selectedChatRoom,
            channelId: singleChannel?._id,
            senderId: user?.userId,
            message: base64Image,
            time: new Date().toLocaleTimeString(),
            isImage: true,
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    socket.on("sendMessageToChatArea", (newMessage) => {
      if (
        newMessage.channelName === selectedChatRoom &&
        newMessage.serverName === singleChannel?.channelName
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off("sendMessageToChatArea");
    };
  }, [socket, selectedChatRoom]);

  useEffect(() => {
    setMessages([]);
  }, [selectedChatRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  useEffect(() => {
    setSelectedChatRoom("");
  }, []);

  const getChannelMessages = async () => {
    setLoadingForChat(true);
    try {
      const response = await axios.get(
        `${url}/api/message/getchannelmessages`,
        {
          params: {
            channelId: singleChannel?._id,
            chatName: selectedChatRoom,
          },
        }
      );
      setMessages(response.data);
    }finally {
      setLoadingForChat(false);
    }
  };

  useEffect(() => {
    getChannelMessages();
  }, [selectedChatRoom]);

  return (
    <div className="w-[70%] h-screen bg-[#313338] flex flex-col">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-150"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      ) : (
        <>
          {selectedChatRoom && (
            <div className="w-full h-14 bg-[#313338] text-white text-base font-semibold flex gap-3 items-center px-5 border-b border-gray-700">
              <FaHashtag className="text-2xl text-gray-400" />
              <h3>{selectedChatRoom}</h3>
            </div>
          )}

          <div className="w-full h-full flex flex-col gap-6 overflow-hidden overflow-y-auto custom-scrollbar p-5">
            {!containsMessage && !selectedChatRoom ? (
              <div className="flex flex-col items-center justify-center h-screen bg-[#313338] text-gray-100">
                {/* Channel Icon */}
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.5-4.5M15 10l-4.5-4.5M15 10h6m-6 0l-4.5 4.5M15 10l-4.5 4.5M9 14H3m6 0h6m6 0h-6"
                    />
                  </svg>
                </div>

                {/* Welcome Message */}
                <div className="mt-6 text-center">
                  <h1 className="text-2xl font-bold">
                    Welcome to the{" "}
                    <span className="text-indigo-400">
                      #{singleChannel?.channelName}
                    </span>
                    !
                  </h1>
                  <p className="mt-2 text-gray-400">
                    Feel free to start the conversation or explore what others
                    are saying.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {loadingForChat ? (
                 <div className="flex items-center justify-center h-full">
                 <div className="relative w-16 h-16">
                   <svg
                     className="animate-spin"
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 50 50"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="4"
                   >
                     <circle
                       className="opacity-25"
                       cx="25"
                       cy="25"
                       r="20"
                       stroke="currentColor"
                       strokeLinecap="round"
                     />
                     <circle
                       className="opacity-75"
                       cx="25"
                       cy="25"
                       r="20"
                       stroke="currentColor"
                       strokeLinecap="round"
                       strokeDasharray="126.92"
                       strokeDashoffset="63.46"
                     />
                   </svg>
                 </div>
               </div>
               
                ) : (
                  <>
                    {!messages || messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-28 h-28 mx-auto text-gray-400 mb-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 8h10M7 12h6m5 8v-2a2 2 0 00-2-2H7l-4 4V6a2 2 0 012-2h12a2 2 0 012 2v12z"
                            />
                          </svg>

                          <h2 className="text-lg font-semibold mb-2">
                            No messages yet
                          </h2>
                          <p className="text-sm">
                            Start a conversation or wait for others to send a
                            message.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {messages.map((item, index) => (
                          <ChatComplement key={index} item={item} />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Message Input */}
          {selectedChatRoom !== "" && (
            <div className="w-full h-16 bg-[#2B2D31] flex items-center px-5 gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full h-10 bg-[#40444B] text-gray-200 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 placeholder-gray-400"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                📷
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              <button
                onClick={() => handleSend()}
                className="h-10 px-6 bg-gray-500 text-white font-medium rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
              >
                Send
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatArea;
