import React from 'react'
import ChannelMenu from '../components/ChannelMenu'
import ChatArea from '../components/ChatArea'

const Channel = () => {
  return (
    <div className="w-full flex bg-[#313338]">
     <ChannelMenu />
     <ChatArea />
    </div>
  )
}

export default Channel
