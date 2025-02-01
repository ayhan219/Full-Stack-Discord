import { useUserContext } from "../context/UserContext";
import ChannelMember from "./ChannelMember";
import "../index.css";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type ChannelProps = {
  onlineChannelUsers: {
    _id: string;
    username: string;
    profilePic: string;
  }[];
};

const ChatRightArea = ({ onlineChannelUsers }: ChannelProps) => {
  const { singleChannel, loading,allUser } = useUserContext();
  const [onlineAdmin, setOnlineAdmin] = useState<number>(0);
  const [openChannelMemberArea,setOpenChannelMemberArea] = useState<boolean>(false);

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
    <div className={`${openChannelMemberArea ? "w-[200px] md:w-[300px]" : "w-[20px] bg-[#33343a] md:bg-[#2B2D31]  md:w-[300px]"} h-full flex max-h-screen bg-[#2B2D31] shadow-lg rounded-lg overflow-hidden overflow-y-auto custom-scrollbar absolute md:static right-0 transition-all duration-200 ease-in-out`}>
      <div onClick={()=>setOpenChannelMemberArea(true)} className={`w-full flex ${!openChannelMemberArea ? "flex":"hidden" } justify-center pt-3 cursor-pointer md:hidden`}>
      <FaArrowLeft />
      </div>
      <div onClick={()=>setOpenChannelMemberArea(false)} className={`w-full flex ${!openChannelMemberArea ? "hidden":"flex" } justify-center pt-3 cursor-pointer md:hidden absolute right-0`}>
      <FaArrowRight />
      </div>
      <div className={`${openChannelMemberArea ? "flex" : "hidden"}hidden md:flex flex-col`}>
      {loading ? (
        <div className="flex items-center justify-center text-center w-full h-full">
  
        </div>
      ) : (
        <>
          {/* Online Members */}
          <div className="p-4 rounded-lg">
            <h4 className="text-gray-400 text-xs md:text-sm font-medium mb-4">Online</h4>
            <div className="space-y-6">
              {/* Admin Group */}
              <div className="w-full">
                {
                  onlineAdmin > 0 &&
                  <p className="text-xs font-semibold px-3 text-[#949BA1] mb-2">
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
                  <p className="text-xs font-semibold px-3 text-[#949BA1] mb-2">
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
    </div>
  );
};

export default ChatRightArea;
