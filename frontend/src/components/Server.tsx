import { IoMdArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useEffect } from "react";

interface ServerProps {
  item: {
    _id: string;
    channelName: string;
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
  const { getSingleChannel, channels } = useUserContext();

  const initials = item.channelName
    .split(" ")
    .map((word) => word.substring(0, 2))
    .join("")
    .toUpperCase();


  useEffect(() => {
    getSingleChannel(item._id);
  }, [channels]);

  return (
    <div
      onClick={() => setActiveChannel(item._id)}
      className="w-full h-16 flex items-center justify-center relative"
    >
      <Link
        onClick={() => getSingleChannel(item._id)}
        to={"/channel"}
        className="w-14 h-14 rounded-full bg-white flex items-center justify-center cursor-pointer"
      >
        <p className="text-black font-bold text-lg">{initials}</p>
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
