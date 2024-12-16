import { useState } from "react";
import ChannelMenu from "../components/ChannelMenu";
import ChatArea from "../components/ChatArea";
import ChatRightArea from "../components/ChatRightArea";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

interface SingleChannel {
  _id:string,
  channelName:string,
}

const Channel = () => {


  

  return (
    <div className="w-full flex bg-[#313338]">
      <ChannelMenu  />
      <ChatArea  />
      <ChatRightArea />
    </div>
  );
};

export default Channel;
