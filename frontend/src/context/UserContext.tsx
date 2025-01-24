import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

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

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  turnMicOff: boolean;
  setTurnMicOff: (turnMicOff: boolean) => void;
  turnHeadOff: boolean;
  setTurnHeadOff: (turnHeadOff: boolean) => void;
  openCreateChannel: boolean;
  setOpenCreateChannel: (openCreateChannel: boolean) => void;
  openCreateRoom: boolean;
  setOpenCreateRoom: (openCreateRoom: boolean) => void;
  openCreateVoiceRoom: boolean;
  setOpenCreateVoiceRoom: (openCreateVoiceRoom: boolean) => void;
  singleChannel: SingleChannel | null;
  setSingleChannel: React.Dispatch<React.SetStateAction<SingleChannel | null>>;
  getSingleChannel: (id: string) => void;
  selectedChatRoom: string;
  setSelectedChatRoom: (selectedChatRoom: string) => void;
  channels: Channel[];
  setChannels: React.Dispatch<React.SetStateAction<Channel[]>>;
  activeMenu: string;
  setActiveMenu: (activeMenu: string) => void;
  socket: Socket;
  getCurrentUser: () => void;
  friendId: string;
  setFriendId: (friendId: string) => void;
  notificationNumber: number;
  setNotificationNumber: (notificationNumber: number) => void;
  deleteNotification: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  connectedToVoice: boolean;
  setConnectedToVoice: (connectedToVoice: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  handleDisconnect: boolean;
  setHandleDisconnect: (handleDisconnect: boolean) => void;
  activeChannel: string;
  setActiveChannel: (activeChannel: string) => void;
  voiceRoomName: string;
  setVoiceRoomName: (voiceRoomName: string) => void;
  onlineFriendUserIds: string[];
  setOnlineFriendUserIds: (onlineFriendUserIds: string[]) => void;
  onlineFriends: Friend[];
  setOnlineFriends: (onlineFriends: Friend[]) => void;
}

interface Friend {
  username: string;
  _id: string;
  profilePic: string;
}

interface Channel {
  _id: string;
  channelName: string;
}

interface ChatChannel {
  roomName: string;
  messages: string[];
}

type VoiceUser = {
  _id: string;
  username: string;
  profilePic: string;
};

interface VoiceChannel {
  voiceRoomName: string;
  voiceUsers: VoiceUser[];
  _id: string;
}

interface SingleChannel {
  _id: string;
  channelName: string;
  chatChannel: ChatChannel[];
  voiceChannel: VoiceChannel[];
  admin: string[];
  channelUsers: [];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

const socket = io("http://localhost:3001"); // Socket.IO client instance

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [turnMicOff, setTurnMicOff] = useState<boolean>(false);
  const [turnHeadOff, setTurnHeadOff] = useState<boolean>(false);
  const [openCreateChannel, setOpenCreateChannel] = useState<boolean>(false);
  const [singleChannel, setSingleChannel] = useState<SingleChannel | null>(
    null
  );
  const [openCreateRoom, setOpenCreateRoom] = useState<boolean>(false);
  const [openCreateVoiceRoom, setOpenCreateVoiceRoom] =
    useState<boolean>(false);
  const [selectedChatRoom, setSelectedChatRoom] = useState<string>("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeMenu, setActiveMenu] = useState<string>("friends");
  const [friendId, setFriendId] = useState<string>("");
  const [notificationNumber, setNotificationNumber] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectedToVoice, setConnectedToVoice] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [handleDisconnect, setHandleDisconnect] = useState<boolean>(false);
  const [activeChannel, setActiveChannel] = useState<string>("home");
  const [voiceRoomName, setVoiceRoomName] = useState<string>("");
  const [onlineFriendUserIds, setOnlineFriendUserIds] = useState<string[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<Friend[]>([]);

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getcurrent",
        {
          withCredentials: true,
        }
      );

      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // Register user with socket after they are fetched
  useEffect(() => {
    if (user?.userId) {
      socket.emit("userOnline", user?.userId);
      const userIds = user?.friends.map((friend: any) => friend);
      const senderData = {
        _id: user?.userId,
        username: user?.username,
        profilePic: user?.profilePic,
      };
      socket.emit("getOnlineUser", {
        userIds: userIds,
        senderId: senderData,
      });
    }
  }, [user?.userId]);

  const getSingleChannel = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/channel/getchannelsingle",
        {
          params: {
            channelId: id,
          },
        }
      );

      setSingleChannel(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/addnotification",
        {
          userId: user?.userId,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/deletenotification",
        {
          userId: user?.userId,
        }
      );
      console.log(response);
      setNotificationNumber(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getNotification = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getnotification",
        {
          params: {
            userId: user?.userId,
          },
        }
      );
      setNotificationNumber(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getNotification();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on(
        "friendRequestNotification",
        (senderId: string, username: string, profilePic: string) => {
          setNotificationNumber(
            (prevNotificationNumber) => prevNotificationNumber + 1
          );
          if (user?.userId) {
            addNotification();
          }
          console.log("Notification received:", senderId);
          setUser((prev: User | null) => {
            if (!prev) return prev;

            const newFriend: Friend = {
              username: username,
              _id: senderId,
              profilePic: profilePic,
            };
            return {
              ...prev,
              pendingFriend: [...prev.pendingFriend, newFriend],
            };
          });
        }
      );
      socket.on(
        "sendReceiverIdToUser",
        (
          senderId: string,
          selectedValue: string,
          username: string,
          profilePic: string
        ) => {
          console.log("Notification received:", senderId);
          if (selectedValue === "accept") {
            setUser((prev: User | null) => {
              if (!prev) return prev;

              const newFriend: Friend = {
                username: username,
                _id: senderId,
                profilePic,
              };
              return {
                ...prev,
                friends: [...prev.friends, newFriend],
              };
            });
          } else {
            return;
          }
        }
      );
      socket.on("dataToServer", (data) => {
        const { roomName, messages } = data;
        setSingleChannel((prev: SingleChannel | null) => {
          if (!prev) {
            return prev;
          }
          const fixedChatRoom = {
            ...roomName,
            roomName: roomName,
          };
          return {
            ...prev,
            chatChannel: [...prev.chatChannel, fixedChatRoom],
          };
        });
      });
      socket.on("dataToServerVoice", (voiceRoom) => {
        console.log(voiceRoom);

        setSingleChannel((prev: SingleChannel | null) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            voiceChannel: [...prev.voiceChannel, voiceRoom],
          };
        });
      });
      socket.on("onlineFriends", (onlineFriendsFromSocket) => {
        setOnlineFriends(onlineFriendsFromSocket);
      });
      socket.on("ImOnline", (userId) => {
        setOnlineFriends((prev) => {
          if (!prev.some((friend) => friend._id === userId._id)) {
            return [...prev, userId];
          }
          return prev;
        });
      });

      socket.on("userThatDisconnected",(senderId)=>{
        setOnlineFriends((prev)=>{
          if(!prev){
            return prev;
          }
          const newData = prev.filter((data)=>data._id!==senderId);
          return newData
        })
        
      })
    }

    // Temizleme işlemi
    return () => {
      if (socket) {
        socket.off("friendRequestNotification");
        socket.off("sendReceiverIdToUser");
        socket.off("new_message_notification");
        socket.off("dataToServer");
        socket.off("dataToServerVoice");
        socket.off("onlineFriends");
        socket.off("ImOnline");
        socket.off("userThatDisconnected");
      }
    };
  }, [socket, user]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setTurnMicOff,
        turnMicOff,
        setTurnHeadOff,
        turnHeadOff,
        openCreateChannel,
        setOpenCreateChannel,
        getSingleChannel,
        setSingleChannel,
        singleChannel,
        openCreateRoom,
        setOpenCreateRoom,
        openCreateVoiceRoom,
        setOpenCreateVoiceRoom,
        selectedChatRoom,
        setSelectedChatRoom,
        channels,
        setChannels,
        activeMenu,
        setActiveMenu,
        socket,
        getCurrentUser,
        friendId,
        setFriendId,
        notificationNumber,
        setNotificationNumber,
        deleteNotification,
        loading,
        setLoading,
        connectedToVoice,
        setConnectedToVoice,
        token,
        setToken,
        handleDisconnect,
        setHandleDisconnect,
        activeChannel,
        setActiveChannel,
        voiceRoomName,
        setVoiceRoomName,
        onlineFriendUserIds,
        setOnlineFriendUserIds,
        onlineFriends,
        setOnlineFriends,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
