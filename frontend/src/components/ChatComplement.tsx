import React from 'react'

const ChatComplement = () => {
  return (
    <div className='flex gap-4'>
    <img className='w-12 h-12 rounded-full' src="https://i.pinimg.com/1200x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg" alt="Avatar" />
    <div className='text-gray-200'>
      <div className='flex items-center gap-3'>
        <h3 className='font-semibold'>Ayhan</h3>
        <p className='text-gray-400 text-sm'>15:53 PM</p>
      </div>
      <p className='text-gray-300'>Hey! What's up?</p>
    </div>
  </div>
  )
}

export default ChatComplement
