import  { useState } from 'react'
import { GoPlus } from "react-icons/go";
import ChannelChatItem from './ChannelChatItem';
import ChannelVoiceItem from './ChannelVoiceItem';
import BottomProfile from './BottomProfile';



const ChannelMenu = () => {

  return (
    <div className="w-[15%] h-screen bg-[#2B2D31] flex flex-col">
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
      <BottomProfile />
    </div>
  )
}

export default ChannelMenu
