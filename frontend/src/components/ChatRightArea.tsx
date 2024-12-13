
import ChannelMember from './ChannelMember'

const ChatRightArea = () => {
  return (
    <div className='w-[20%] h-full bg-[#2B2D31]'>
        <div className='w-full h-10 text-gray-400 p-4 text-xl font-semibold'>
            <h3>Members - 3</h3>
        </div>
        <div className='w-full h-auto pt-3'>
            <ChannelMember />
            <ChannelMember />
            <ChannelMember />
            <ChannelMember />


        </div>
    </div>
  )
}

export default ChatRightArea
