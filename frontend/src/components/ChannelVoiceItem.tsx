
import { MdSettingsVoice } from "react-icons/md";


type ChannelVoiceItemProps={
  voiceName:string
  }
const ChannelVoiceItem = ({voiceName}:ChannelVoiceItemProps) => {
  return (
    <div className='w-full h-10 text-gray-400 flex items-center gap-4 px-7 rounded-lg hover:text-white hover:bg-gray-700 cursor-pointer '>
    <MdSettingsVoice className='text-2xl' />
    <p className='font-semibold'>{voiceName}</p>
</div>
  )
}

export default ChannelVoiceItem
