import ChannelMenu from "../components/ChannelMenu";
import ChatArea from "../components/ChatArea";
import ChatRightArea from "../components/ChatRightArea";

const Channel = () => {
  return (
    <div className="w-full flex bg-[#313338]">
      <ChannelMenu />
      <ChatArea />
      <ChatRightArea />
    </div>
  );
};

export default Channel;
