import React from 'react';
import { FaHashtag } from "react-icons/fa6";
import ChatComplement from './ChatComplement';

const ChatArea = () => {
  return (
    <div className='w-[80%] h-screen bg-[#313338] flex flex-col'>
      {/* Channel Header */}
      <div className='w-full h-14 bg-[#313338] text-white text-base font-semibold flex gap-3 items-center px-5 border-b border-gray-700'>
        <FaHashtag className='text-2xl text-gray-400' />
        <h3>Channel Name</h3>
      </div>

      {/* Chat Area */}
      <div className='w-full h-full flex flex-col gap-6 overflow-y-scroll p-5'>
       <ChatComplement />
       <ChatComplement />
       <ChatComplement />
       <ChatComplement />

        

        
      </div>

      {/* Message Input */}
      <div className='w-full h-16 bg-[#2B2D31] flex items-center px-5'>
        <input
          type="text"
          placeholder="Type a message..."
          className='w-full h-10 bg-[#40444B] text-gray-200 rounded-md px-4 focus:outline-none'
        />
      </div>
    </div>
  );
};

export default ChatArea;