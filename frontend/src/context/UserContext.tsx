import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";


type User = {
  userId:string;
  email: string;
  displayName: string;
  username: string;
};

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  turnMicOff:boolean;
  setTurnMicOff:(turnMicOff:boolean)=>void;

  turnHeadOff:boolean;
  setTurnHeadOff:(turnHeadOff:boolean)=>void;

  openCreateChannel:boolean;
  setOpenCreateChannel:(openCreateChannel:boolean)=>void;

  openCreateRoom:boolean;
  setOpenCreateRoom:(openCreateRoom:boolean)=>void;

  singleChannel:SingleChannel | null;
  
  getSingleChannel:(id:string)=>void
  
  
}

interface SingleChannel {
  _id:string,
  channelName:string,
  chatChannel:[],
  voiceChannel:[],
  channelUsers:[],
}

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [turnMicOff, setTurnMicOff] = useState<boolean>(false);
  const [turnHeadOff, setTurnHeadOff] = useState<boolean>(false);
  const [openCreateChannel,setOpenCreateChannel] = useState<boolean>(false);
  const [singleChannel,setSingleChannel] = useState<SingleChannel | null>(null);
  const [openCreateRoom,setOpenCreateRoom] = useState<boolean>(false);


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

  const getSingleChannel = async(id:string)=>{
    try {
      const response = await axios.get("http://localhost:5000/api/channel/getchannelsingle",{
        params:{
          channelId:id
        }
      })
      setSingleChannel(response.data)
      console.log(response.data);
      
      
    } catch (error) {
      console.log(error);
      
    }
  }




  return (
    <UserContext.Provider value={{ user, setUser,setTurnMicOff,turnMicOff,setTurnHeadOff,turnHeadOff,openCreateChannel,setOpenCreateChannel,getSingleChannel,singleChannel,openCreateRoom,setOpenCreateRoom}}>
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
