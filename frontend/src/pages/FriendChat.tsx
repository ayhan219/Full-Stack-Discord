import Menu from "../components/Menu";
import { useUserContext } from "../context/UserContext";
import { FaPhoneAlt } from "react-icons/fa";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { SiPinboard } from "react-icons/si";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { CiSearch } from "react-icons/ci";
import PrivateChat from "../components/PrivateChat";
import "../index.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Message {
  senderId?: string;
  receiverId: string | null;
  message: string;
  time: string;
  isImage: boolean;
}

type User = {
  userId: string;
  email: string;
  displayName: string;
  username: string;
  profilePic: string;
  friends: Friend[];
  pendingFriend: Friend[];
  menuChat: Friend[];
};

interface Friend {
  username: string;
  _id: string;
  profilePic: string;
}

const FriendChat = () => {
  const { user, socket, setUser, setLoading, loading, setChattingFriend } =
    useUserContext();

  const { activeMenu, setActiveMenu, onlineFriends } = useUserContext();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { id } = useParams();

  useEffect(() => {
    socket.on("receive_message", (newMessage) => {   
      setMessages((prev: Message[]) => {
        return [...prev, newMessage];
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const getMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/message/getmessages",
        {
          params: {
            senderId: user?.userId,
            receiverId: localStorage.getItem("friendId"),
          },
        }
      );

      setMessages(response.data);
    } catch (error) {
      console.log(error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && localStorage.getItem("friendId")) {
      getMessages();
      setChattingFriend(id || "");
    }
  }, [user, localStorage.getItem("friendId")]);

  const saveMessagesToDB = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/message/savechat",
        {
          senderId: user?.userId,
          receiverId: localStorage.getItem("friendId"),
          message,
          time: new Date().toLocaleTimeString(),
          isImage: false,
        }
      );

      if (response.status === 200) {
        setUser((prev: User | null) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            menuChat: response.data,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      senderId: user?.userId,
      receiverId: localStorage.getItem("friendId") || null,
      message,
      isImage: false,
      time: getCurrentTime()
    };

    socket.emit("send_message", { newMessage, profilePic: user?.profilePic });
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    saveMessagesToDB();
    setMessage("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result as string;

      const newMessage = {
        senderId: user?.userId,
        receiverId: localStorage.getItem("friendId") || null,
        message: base64Image,
        time: getCurrentTime(),
        isImage: true,
      };

      socket.emit("send_message", { newMessage, profilePic: user?.profilePic });
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        await axios.post("http://localhost:5000/api/message/savechat", {
          senderId: user?.userId,
          receiverId: localStorage.getItem("friendId"),
          message: base64Image,
          time: new Date().toLocaleTimeString(),
          isImage: true,
        });
      } catch (error) {
        console.log(error);
      }
    };
    reader.readAsDataURL(file);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full h-screen flex bg-[#313338]">
      <Menu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex flex-col w-[calc(100%-270px)] h-full bg-[#2F3136]">
        {/* Top Bar */}
        <div className="w-full h-16 bg-[#292B2F] flex justify-between items-center px-4 border-b border-gray-700">
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={
                `http://localhost:5000${localStorage.getItem("profilePic")}` ||
                "default-profile-pic.jpg"
              }
              alt="Profile"
            />
            <div>
              <h3 className="text-white font-semibold text-lg">
                {localStorage.getItem("username")}
                {onlineFriends.map(
                  (item) =>
                    item.username === localStorage.getItem("username") && (
                      <p className="text-xs text-green-500">online</p>
                    )
                )}
              </h3>
            </div>
          </div>

          {/* Icons Section */}
          <div className="flex items-center gap-4 text-gray-300">
            <FaPhoneAlt className="text-xl cursor-pointer hover:text-white transition duration-200" />
            <BsFillCameraVideoFill className="text-xl cursor-pointer hover:text-white transition duration-200" />
            <SiPinboard className="text-xl cursor-pointer hover:text-white transition duration-200" />
            <LiaUserFriendsSolid className="text-xl cursor-pointer hover:text-white transition duration-200" />

            {/* Search Bar */}
            <div className="relative flex items-center">
              <input
                className="w-40 h-8 bg-[#202225] text-sm text-white rounded-lg pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search"
                type="text"
              />
              <CiSearch className="absolute right-2 text-gray-400 text-lg pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-[#2F3136] text-gray-400 flex flex-col custom-scrollbar overflow-y-auto">
          {/* Messages Container */}
          <div className="flex-1 p-4 flex flex-col justify-end">
            {messages.length <= 0 ? (
              <div className="flex items-center justify-center h-full bg-gradient-to-r  rounded-lg text-center text-white p-6 shadow-lg">
                <div className="space-y-4">
                  <h2 className="text-3xl font-semibold">No Messages Yet!</h2>
                  <p className="text-lg opacity-80">
                    Start a conversation with your friend.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4">
                {messages.map((item, index) => (
                  <PrivateChat key={index} item={item} />
                ))}
                <div ref={messagesEndRef} />
                </div>
              </>
            )}
          </div>
        </div>
        {/* Message Input Section */}
        <div className="w-full p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <input
              className="w-full bg-[#40444B] text-white rounded-lg p-3 focus:outline-none focus:ring-2"
              placeholder="Type a message..."
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <div className="flex gap-5">
              <label htmlFor="image-upload" className="cursor-pointer text-2xl">
                📷
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <button onClick={() => sendMessage()} className="text-blue-500">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendChat;
