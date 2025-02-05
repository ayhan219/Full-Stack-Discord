import { Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

interface NotificationData {
  senderId: string;
  profilePic: string;
}

interface FriendNotificationProps {
  item: NotificationData;
}

const FriendNotification = ({ item }: FriendNotificationProps) => {
  const { setUserMessageNotification,url } = useUserContext();

  const handleDeleteNotification = () => {
    setUserMessageNotification((prev: NotificationData[]) => {
      const notifications = prev || [];

      const filteredData = notifications.filter(
        (notification: NotificationData) =>
          notification.senderId !== item.senderId
      );

      return filteredData;
    });
  };

  return (
    <div
      onClick={handleDeleteNotification}
      className="w-full h-16 flex items-center justify-center relative"
    >
      <Link
        to={`/friendchat/${item.senderId}`}
        className="w-14 h-14 rounded-full bg-white flex items-center justify-center cursor-pointer relative"
      >
        <img
          className="w-14 h-14 rounded-full"
          src={`${url}${item.profilePic}`}
          alt=""
        />
      </Link>
      <div className=" w-5 h-5 rounded-full bg-red-600 absolute bottom-0 right-2  z-30 flex items-center justify-center">
        <p className="font-bold text-sm">1</p>
      </div>
    </div>
  );
};

export default FriendNotification;
