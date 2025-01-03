import { FaHashtag } from "react-icons/fa6";
import ChatComplement from "./ChatComplement";
import "../index.css";
import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";

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
  const { singleChannel, selectedChatRoom, socket, user } = useUserContext();
  const [containsMessage, setContainsMessage] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

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
      if (newMessage.channelName === selectedChatRoom && newMessage.serverName === singleChannel?.channelName) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off("sendMessageToChatArea");
    };
  }, [socket,selectedChatRoom]);

  useEffect(() => {
    setMessages([]);
  }, [selectedChatRoom]);

  return (
    <div className="w-[70%] h-screen bg-[#313338] flex flex-col">
      <div className="w-full h-14 bg-[#313338] text-white text-base font-semibold flex gap-3 items-center px-5 border-b border-gray-700">
        <FaHashtag className="text-2xl text-gray-400" />
        <h3>{selectedChatRoom}</h3>
      </div>

      <div className="w-full h-full flex flex-col gap-6 overflow-hidden overflow-y-auto custom-scrollbar p-5">
        {!containsMessage ? (
          <div className="flex flex-col items-center justify-center space-y-4 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-gray-500"
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

            {/* Empty state message */}
            <div className="text-xl font-semibold">No messages yet</div>
            <div className="text-center text-gray-500">
              Start the conversation and send the first message
            </div>
          </div>
        ) : (
          <>
            {messages.map((item, index) => (
              <ChatComplement key={index} item={item} />
            ))}
          </>
        )}
      </div>

      {/* Message Input */}
      {selectedChatRoom !== "" && (
        <div className="w-full h-16 bg-[#2B2D31] flex items-center px-5">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full h-10 bg-[#40444B] text-gray-200 rounded-md px-4 focus:outline-none"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button onClick={handleSend} className="text-blue-500">
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
