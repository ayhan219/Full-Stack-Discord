import  { useState } from 'react'
import { GoPlus } from "react-icons/go";
import ChannelChatItem from './ChannelChatItem';
import ChannelVoiceItem from './ChannelVoiceItem';
import { FaMicrophone } from "react-icons/fa";
import { PiMicrophoneSlashFill } from "react-icons/pi";
import { FaHeadphones } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbHeadphonesOff } from "react-icons/tb";



const ChannelMenu = () => {

  const [turnMicOff,setTurnMicOff] = useState<boolean>(false);
  const [turnHeadOff,setTurnHeadOff] = useState<boolean>(false);

  return (
    <div className="w-[20%] h-screen bg-[#2B2D31] flex flex-col">
      <div className='w-full h-16 flex items-center border-b border-gray-800'>
        <div className='font-bold text-[#D6D9DC] text-xl py-3 px-5'>
        Channel Name
        </div>
      </div>
      <div className='w-full h-auto'>
        <div className='w-full text-gray-400 flex items-center justify-between p-5 font-bold'>
            <p className='hover:text-gray-200 cursor-pointer'>Chat Channel</p>
            <GoPlus className='hover:text-gray-200 cursor-pointer'/>
        </div>

        <div className='w-full h-auto flex flex-col gap-5'>
        <ChannelChatItem />
        <ChannelChatItem />
        <ChannelChatItem />
        <ChannelChatItem />
        </div>
        
        <div className='w-full text-gray-400 flex items-center justify-between p-5 font-bold mt-5'>
            <p className='hover:text-gray-200 cursor-pointer'>Voice Channel</p>
            <GoPlus className='hover:text-gray-200 cursor-pointer'/>
        </div>

        <div className='w-full h-auto flex flex-col gap-3'>
           <ChannelVoiceItem />
           <ChannelVoiceItem />
           <ChannelVoiceItem />
           <ChannelVoiceItem />
           

        </div>
      </div>
      <div className='w-full h-16 bg-[#232428] mt-auto p-3 '>
        <div className='w-full h-full flex '>
         <div className='flex w-full gap-3'>
         <div className='w-[20%] h-full flex justify-center'>
            <img className='w-10 h-10 rounded-full' src="https://i.pinimg.com/1200x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg" alt="" />
          </div>
          <div className='text-white w-auto max-w-12 flex items-center'>
            <p>Ayhan</p>
          </div>
         </div>
          <div className='flex  text-white text-xl gap-3 items-center'>
            {
              !turnMicOff ? <FaMicrophone onClick={()=>setTurnMicOff(!turnMicOff)} className='cursor-pointer' /> :
              <PiMicrophoneSlashFill onClick={()=>setTurnMicOff(!turnMicOff)} className='cursor-pointer text-red-600' />
            }
            {
              !turnHeadOff ? <FaHeadphones  onClick={()=>setTurnHeadOff(!turnHeadOff)} className='cursor-pointer' /> :
              <TbHeadphonesOff onClick={()=>setTurnHeadOff(!turnHeadOff)} className='cursor-pointer text-red-600' />
            }
            <IoMdSettings className='cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChannelMenu
