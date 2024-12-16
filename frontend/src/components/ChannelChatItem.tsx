
import { FaHashtag } from "react-icons/fa6";

type ChannelChatItemProps={
chatName:string
}

const ChannelChatItem = ({chatName}:ChannelChatItemProps) => {
  return (
    <div className='w-full h-10 text-gray-400 flex items-center gap-3 px-7 hover:bg-gray-700 rounded-lg cursor-pointer hover:text-white  '>
            <FaHashtag className='text-2xl' />
            <p className='font-semibold'>{chatName}</p>
        </div>
  )
}

export default ChannelChatItem
