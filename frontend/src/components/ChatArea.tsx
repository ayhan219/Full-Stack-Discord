import React from 'react'
import { FaHashtag } from "react-icons/fa6";

const ChatArea = () => {
  return (
    <div className='w-[80%] h-screen bg-[#313338]'>
        <div className='w-full h-10 bg-[#313338] text-white text-base font-semibold flex gap-5 items-center px-5 border-b border-gray-700'>
        <FaHashtag className='text-2xl text-gray-400' />
            <h3>Channel Name</h3>
        </div>
    </div>
  )
}

export default ChatArea
