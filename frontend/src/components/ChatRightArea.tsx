
import { useUserContext } from '../context/UserContext'
import ChannelMember from './ChannelMember'

const ChatRightArea = () => {

  const {singleChannel} = useUserContext();
  return (
    <div className='w-[270px] h-full bg-[#2B2D31]'>
        <div className='w-full h-10 text-gray-400 p-4 text-xl font-semibold'>
            <h3>Members - {singleChannel?.channelUsers.length}</h3>
        </div>
        <div className='w-full h-auto pt-3'>
            {
              singleChannel?.channelUsers.map((item,index)=>(
                <ChannelMember key={index} name={item} />
              ))
            }


        </div>
    </div>
  )
}

export default ChatRightArea
