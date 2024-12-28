import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { MdClose } from "react-icons/md";

type MenuFriendProps = {
  item: {
    username: string;
    _id: string;
    profilePic: string;
  };
};

const MenuFriends = ({ item }: MenuFriendProps) => {
  const navigate = useNavigate();
  const { setFriendId } = useUserContext();

  const setFriend = async () => {
    setFriendId(item._id);
    localStorage.setItem("friendId", item._id);
    localStorage.setItem("profilePic", item.profilePic);
    localStorage.setItem("username", item.username);
  };

  return (
    <div
      onClick={() => {
        setFriend();
        navigate("/friendchat");
      }}
      className="w-full h-14 flex items-center px-6 gap-3 cursor-pointer hover:bg-gray-400 ease-in-out duration-100 text-gray-400 hover:text-gray-800 hover:rounded-lg relative group"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              className="w-11 h-11 rounded-full"
              src={`http://localhost:5000${item.profilePic}`}
              alt=""
            />
            <div className="w-3 h-3 rounded-full bg-green-700 absolute right-0 bottom-0"></div>
          </div>
          <div className="font-semibold">
            <p>{item.username}</p>
          </div>
        </div>

        <div className="absolute right-3 opacity-0 group-hover:opacity-100  text-gray-600 font-semibold text-xl">
          <MdClose className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default MenuFriends;
