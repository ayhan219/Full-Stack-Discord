import { FaHashtag } from "react-icons/fa6";
import ChatComplement from "./ChatComplement";
import "../index.css";
import { useUserContext } from "../context/UserContext";
import { useEffect, useRef, useState } from "react";
import VideoConferenceRoom from "./VideoConferenceRoom";

interface Message {
  channelName: string;
  message: string;
  serverName: string;
  username: string;
  profilePic: string;
  time: string;
  userId: string;
}

const ChatArea = () => {
  const {
    singleChannel,
    selectedChatRoom,
    setSelectedChatRoom,
    socket,
    user,
    loading,
    connectedToVoice,
  } = useUserContext();
  const [containsMessage, setContainsMessage] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  const handleSend = () => {
    if (message.trim() !== "") {
      socket.emit(
        "sendMessageToChat",
        singleChannel?.channelName,
        selectedChatRoom,
        user?.userId,
        user?.username,
        user?.profilePic,
        message
      );
      setMessage("");
    }
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(()=>{
    setSelectedChatRoom("");
  },[])

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
                {!messages ? (
                  <div></div>
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
                      <>
                        {messages.map((item, index) => (
                          <ChatComplement key={index} item={item} />
                        ))}
                        <div ref={messagesEndRef} />
                      </>
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
              <button
                onClick={handleSend}
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
