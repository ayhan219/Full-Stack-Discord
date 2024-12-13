
import { FaHashtag } from "react-icons/fa6";

const ChannelChatItem = () => {
  return (
    <div className='w-full h-10 text-gray-400 flex items-center gap-3 px-7 hover:bg-gray-700 rounded-lg cursor-pointer hover:text-white  '>
            <FaHashtag className='text-2xl' />
            <p className='font-semibold'>channel name 1</p>
        </div>
  )
}

export default ChannelChatItem
