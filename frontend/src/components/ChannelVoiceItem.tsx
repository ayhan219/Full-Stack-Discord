
import { MdSettingsVoice } from "react-icons/md";

const ChannelVoiceItem = () => {
  return (
    <div className='w-full h-10 text-gray-400 flex items-center gap-4 px-7 rounded-lg hover:text-white hover:bg-gray-700 cursor-pointer '>
    <MdSettingsVoice className='text-2xl' />
    <p className='font-semibold'>Voice Channel 1</p>
</div>
  )
}

export default ChannelVoiceItem
