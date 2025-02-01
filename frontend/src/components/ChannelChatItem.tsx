
import { FaHashtag } from "react-icons/fa6";
import { useUserContext } from "../context/UserContext";

type ChannelChatItemProps={
chatName:string;
setIsAreaOpen:(data:boolean)=>void;
}

const ChannelChatItem = ({chatName,setIsAreaOpen}:ChannelChatItemProps) => {

  const {setSelectedChatRoom,setActiveRoom} = useUserContext();

  const handleSelectedRoom = ()=>{
    setSelectedChatRoom(chatName);
    setIsAreaOpen(false);
    setActiveRoom("chat")
    
  }
  return (
    <div onClick={()=>handleSelectedRoom()} className='w-full h-10 text-gray-400 flex items-center gap-3 px-7 hover:bg-gray-700 rounded-lg cursor-pointer hover:text-white  '>
            <FaHashtag className='text-xl md:text-2xl' />
            <p className='font-semibold text-sm md:text-base'>{chatName}</p>
        </div>
  )
}

export default ChannelChatItem
