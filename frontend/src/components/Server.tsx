import { IoMdArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useEffect } from "react";
import { PiSpeakerHighFill } from "react-icons/pi";

interface ServerProps {
  item: {
    _id: string;
    channelName: string;
    channelPic:string
  };
  index: number;
  activeChannel: string;
  setActiveChannel: (activeChannel: string) => void;
  isActive: boolean;
}

const Server = ({
  item,
  activeChannel,
  setActiveChannel,
  isActive,
}: ServerProps) => {
  const {
    getSingleChannel,
    setActiveRoom,
    setSelectedChatRoom,
    whichChannelConnected,
    setActiveMenuFriend
  } = useUserContext();

  const initials = item.channelName
    ?.split(" ")
    .map((word) => word.substring(0, 2))
    .join("")
    .toUpperCase();

  useEffect(() => {
    if (activeChannel === item._id) {
      getSingleChannel(item._id);
    }
  }, [activeChannel, item._id]);

  return (
    <div
      onClick={() => {
        setActiveChannel(item._id);
        setActiveRoom("chat");
        setSelectedChatRoom("");
      }}
      className="w-full h-16 flex items-center justify-center relative"
      key={item._id}
    >
      <Link
        onClick={() => {
          getSingleChannel(item._id)
          setActiveMenuFriend(item._id)
        }}
        to={`/channel/${item._id}`}
        className="w-11 h-11 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center cursor-pointer relative"
      >
        {
          item.channelPic !== "" ?
          <img className="w-11 h-11  md:w-14 md:h-14 rounded-full" src={`http://localhost:5000${item.channelPic}`} alt="" /> :
          <p className="text-black font-bold text-lg">{initials}</p>
        }
        
        {whichChannelConnected === item.channelName && (
          <div className="absolute left-0 top-0 flex items-center gap-2 p-1 bg-red-500 text-white rounded-md shadow-lg animate-pulse">
            <PiSpeakerHighFill className="text-xs" />
          </div>
        )}
      </Link>

      {isActive ? (
        <div
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-r-lg bg-white transition-all duration-300`}
        ></div>
      ) : (
        <div
          className={`text-white text-xl absolute left-[-5px] flex items-center justify-center`}
        >
          <IoMdArrowDropright />
        </div>
      )}
    </div>
  );
};

export default Server;
