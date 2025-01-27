import { useUserContext } from "../context/UserContext";
import ChannelMember from "./ChannelMember";
import "../index.css";
import { useEffect, useState } from "react";

type ChannelProps = {
  onlineChannelUsers: {
    _id: string;
    username: string;
    profilePic: string;
  }[];
};

const ChatRightArea = ({ onlineChannelUsers }: ChannelProps) => {
  const { singleChannel, loading } = useUserContext();
  const [onlineAdmin, setOnlineAdmin] = useState<number>(0);

  const findOnlineAdmin = () => {
    var count = 0;
    onlineChannelUsers.map((item) => {
      if (singleChannel?.admin.includes(item._id)) {
        count++;
      }
    });
    setOnlineAdmin(count);
  };


  useEffect(() => {
    findOnlineAdmin();
  }, [singleChannel,onlineChannelUsers]);

  return (
    <div className="w-[300px] h-full bg-[#2B2D31] shadow-lg rounded-lg overflow-hidden overflow-y-auto custom-scrollbar">
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <span className="text-gray-400 text-lg animate-pulse">
            Loading...
          </span>
        </div>
      ) : (
        <>
          {/* Online Members */}
          <div className="p-3  rounded-lg">
            <h4 className="text-gray-400 text-sm font-medium mb-4">Online</h4>
            <div className="space-y-6">
              {/* Admin Group */}
              <div className="w-full">
                {
                  onlineAdmin > 0 &&
                  <p className="text-sm font-semibold px-3 text-[#949BA1] mb-2">
                  ADMIN - {onlineAdmin}
                </p>
                }
                <div className="space-y-3">
                  {onlineChannelUsers.map(
                    (item, index) =>
                      singleChannel?.admin.includes(item._id) && (
                        <ChannelMember
                          key={index}
                          item={item}
                          onlineChannelUsers={onlineChannelUsers}
                        />
                      )
                  )}
                </div>
              </div>

              {/* Member Group */}
              <div className="w-full">
                {onlineChannelUsers.length - onlineAdmin > 0 && (
                  <p className="text-sm font-semibold px-3 text-[#949BA1] mb-2">
                    MEMBERS - {onlineChannelUsers.length - onlineAdmin}
                  </p>
                )}
                <div className="space-y-3">
                  {onlineChannelUsers.map(
                    (item, index) =>
                      !singleChannel?.admin.includes(item._id) && (
                        <ChannelMember
                          key={index}
                          item={item}
                          onlineChannelUsers={onlineChannelUsers}
                        />
                      )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-600 mx-4" />

          {/* Offline Members */}
          <div className="p-4">
            <h4 className="text-gray-400 text-sm font-medium mb-2">Offline</h4>
            <div className="space-y-3  opacity-45">
              {singleChannel?.channelUsers.map(
                (item: any, index) =>
                  !onlineChannelUsers.some((user) => user._id === item._id) && (
                    <ChannelMember
                      key={index}
                      item={item}
                      onlineChannelUsers={onlineChannelUsers}
                    />
                  )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatRightArea;
