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
  setOnlineFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
  allUser: string[];
  setAllUser: React.Dispatch<React.SetStateAction<string[]>>;
  isCameraOn: boolean;
  setIsCameraOn: (isCameraOn: boolean) => void;
  activeRoom: string;
  setActiveRoom: (activeRoom: string) => void;
  whichChannelConnected: string;
  setWhichChannelConnected: (whichChannelConnected: string) => void;
  userMessageNotification: NotificationData[];
  setUserMessageNotification: React.Dispatch<
    React.SetStateAction<NotificationData[]>
  >;
  chattingFriend: string;
  setChattingFriend: (chattingFriend: string) => void;
  activeMenuFriend: string;
  setActiveMenuFriend: (activeMenuFriend: string) => void;
  url:string,
  setUrl:(url:string)=>void;
  channelUsers:ChannelUser[];
  setChannelUsers:(channelUsers:ChannelUser[])=>void;
}

interface Friend {
  username: string;
  _id: string;
  profilePic: string;
}

interface ChannelUser{
  username: string;
  _id: string;
  profilePic: string;
}

interface Channel {
  _id: string;
  channelName: string;
  channelUsers: [];
  channelPic: string;
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
  channelUsers: VoiceUser[];
  channelPic: string;
}

interface NotificationData {
  senderId: string;
  profilePic: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

const socket = io("https://full-stack-discord-socket.onrender.com"); // Socket.IO client instance

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
  const [allUser, setAllUser] = useState<string[]>([]);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [activeRoom, setActiveRoom] = useState("");
  const [whichChannelConnected, setWhichChannelConnected] =
    useState<string>("");
  const [userMessageNotification, setUserMessageNotification] = useState<
    NotificationData[]
  >([]);
  const [chattingFriend, setChattingFriend] = useState<string>("");
  const [activeMenuFriend, setActiveMenuFriend] = useState<string>("");
  const [channelUsers,setChannelUsers] = useState<ChannelUser[]>([]);
  const [url,setUrl] = useState<string>("https://full-stack-discord.onrender.com")

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        `${url}/api/auth/getcurrent`,
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
    handleUserRefreshPage();
  }, []);

const handleUserRefreshPage = async () => {
  if(localStorage.getItem("whichChannelConnected")!==""){
    let getChannelId = localStorage.getItem("whichChannelConnected");
    let getUserId = localStorage.getItem("userId");
    try {
      await axios.delete(
          `${url}/api/channel/deleteuserfromvoicechannel`,
          {
              data: {
                  userId: getUserId,
                  channelId: getChannelId
              },
          }
      );
  } catch (error) {
  }finally{
    localStorage.removeItem("whichChannelConnected")
  }
  }
    
};


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
      const uniqueUsers: any[] = [];
      channels.forEach((item) => {
        item.channelUsers.forEach((data: any) => {
          if (!uniqueUsers.some((user) => user._id === data._id)) {
            uniqueUsers.push(data);
          }
        });
      });
      setAllUser(uniqueUsers);
    }
  }, [user?.userId, channels]);

  useEffect(() => {
    if (allUser.length > 0) {
      const data = {
        _id: user?.userId,
        username: user?.username,
        profilePic: user?.profilePic,
      };

      socket.emit("sendChannelUsers", {
        allUser,
        senderId: data,
      });
    }
  }, [allUser]);

  const getSingleChannel = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${url}/api/channel/getchannelsingle`,
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
      await axios.post(
        `${url}/api/auth/addnotification`,
        {
          userId: user?.userId,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNotification = async () => {
    try {
      const response = await axios.post(
        `${url}/api/auth/deletenotification`,
        {
          userId: user?.userId,
        }
      );
      setNotificationNumber(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getNotification = async () => {
    try {
      const response = await axios.get(
        `${url}/api/auth/getnotification`,
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
            setOnlineFriends((prev) => {
              const newFriend: Friend = {
                username: username,
                _id: senderId,
                profilePic,
              };
              if (!prev.some((friend) => friend._id === senderId)) {
                return [...prev, newFriend];
              }
              return prev;
            });
          } else {
            return;
          }
        }
      );
  
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

      socket.on("userThatDisconnected", (senderId) => {
        setOnlineFriends((prev) => {
          if (!prev) {
            return prev;
          }
          const newData = prev.filter((data) => data._id !== senderId);
          return newData;
        });
      });
    }
    socket.on("messageNotification", (data) => {
      const { senderId, profilePic } = data;

      if (chattingFriend === senderId) {
        return;
      } else {
        setUserMessageNotification((prev) => {
          const updatedNotifications = prev ? [...prev] : [];
          const pushData = {
            senderId: senderId,
            profilePic: profilePic,
          };
          const isExist = updatedNotifications.some(
            (item) => item.senderId === senderId
          );

          if (!isExist) {
            updatedNotifications.push(pushData);
          }

          return updatedNotifications;
        });
      }
    });

    socket.on("kickedFromChannel", (data) => {
      const {channelId} = data
      setChannels((prev) => {
        if (!prev) {
          return prev;
        }
        const filteredChannel = prev.filter((data) => data._id !== channelId);
        return filteredChannel;
      });
      setActiveChannel("");
        setActiveRoom("");
        setConnectedToVoice(false);
        setActiveRoom("");
    });

    socket.on("addToAllUser", (data) => {
      console.log("is adding to AllUser?");
      
      const {userData} = data;
      setAllUser((prev) => {
        if (!prev) {
          return [prev];
        }
        if (prev.some((user:any) => user._id === userData.id)) {
          return prev;
        }
        console.log("after allUser",allUser);
        
        return [...prev, userData];
      });
    });

    // Temizleme işlemi
    return () => {
      if (socket) {
        socket.off("friendRequestNotification");
        socket.off("sendReceiverIdToUser");
        socket.off("onlineFriends");
        socket.off("ImOnline");
        socket.off("userThatDisconnected");
        socket.off("messageNotification");
        socket.off("addToAllUser");
      }
    };
  }, [socket, user, onlineFriends, chattingFriend]);

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
        allUser,
        setAllUser,
        isCameraOn,
        setIsCameraOn,
        activeRoom,
        setActiveRoom,
        setWhichChannelConnected,
        whichChannelConnected,
        userMessageNotification,
        setUserMessageNotification,
        chattingFriend,
        setChattingFriend,
        activeMenuFriend,
        setActiveMenuFriend,
        url,
        setUrl,
        channelUsers,
        setChannelUsers
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
