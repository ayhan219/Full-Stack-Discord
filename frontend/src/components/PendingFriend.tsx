import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";



const PendingFriend = () => {
  return (
    
                <div className="w-full h-16 px-3 border-b border-gray-600 flex justify-between">
                    <div className="w-auto h-full flex gap-4 items-center ">
                        <img className="w-8 h-8 rounded-full" src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" alt="" />
                        <p className="text-[#9CA3AF] text-base">deneme</p>
                    </div>
                    <div className="w-24 h-full flex items-center gap-2  ">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2B2D31] cursor-pointer">
                            <TiTick className="text-white text-xl" />
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2B2D31] cursor-pointer">
                            <IoClose className="text-white text-xl" />
                        </div>
                    </div>
                </div>

  )
}

export default PendingFriend
