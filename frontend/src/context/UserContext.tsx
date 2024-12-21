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
  friends: Friend[];
  pendingFriend: Friend[];
  menuChat:Friend[];
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
  getCurrentUser:()=>void;
}

interface Friend{
  username:string,
  _id:string
}



interface Channel {
  _id: string;
  channelName: string;
}

interface ChatChannel {
  roomName: string;
  messages: string[];
}

interface SingleChannel {
  _id: string;
  channelName: string;
  chatChannel: ChatChannel[];
  voiceChannel: string[];
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

  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getcurrent",
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      
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
      socket.emit("userOnline", user.userId);
    }
  }, [user]); // Only run this effect when the user is available

  const getSingleChannel = async (id: string) => {
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
    }
  };


  useEffect(() => {
    
    if (socket) {
      socket.on("friendRequestNotification", (senderId: string,username:string) => {
        console.log("Notification received:", senderId);
        setUser((prev: User | null) => {
          if (!prev) return prev;

          const newFriend: Friend = { username: username, _id: senderId };
          return {
            ...prev,
            pendingFriend: [...prev.pendingFriend, newFriend],
          };
          
        });
      });
      socket.on("sendReceiverIdToUser",(senderId:string,selectedValue:string,username:string)=>{
        console.log("Notification received:", senderId);
        if(selectedValue==="accept"){
          setUser((prev:User | null)=>{
            if (!prev) return prev;

            const newFriend: Friend = { username: username, _id: senderId };
            return{
              ...prev,
              friends:[...prev.friends,newFriend],
            }
          })
        }
        else{
          return;
        }
      })
    }

    // Temizleme işlemi
    return () => {
      if (socket) {
        socket.off("friendRequestNotification");
      }
    };
  }, [socket]);

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
        getCurrentUser
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
