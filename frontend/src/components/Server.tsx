import { IoMdArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

interface ServerProps {
  item: {
    _id: string;
    channelName: string;
  };
  index: number;
}

const Server = ({ item, index }: ServerProps) => {

  const{getSingleChannel} = useUserContext();
 
  const initials = item.channelName
    .split(" ")
    .map(word => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();


    

  return (
    <div  className="w-full h-16 flex items-center justify-center relative">
      <Link onClick={()=>getSingleChannel(item._id)} to={"/channel"} className="w-14 h-14 rounded-full bg-white flex items-center justify-center cursor-pointer">
        <p className="text-black font-bold text-lg">{initials}</p>
      </Link>

      <div className="text-white text-xl absolute left-[-5px] flex items-center justify-center">
        <IoMdArrowDropright />
      </div>
    </div>
  );
};

export default Server;
