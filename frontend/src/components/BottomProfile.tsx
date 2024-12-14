import { FaMicrophone } from "react-icons/fa";
import { PiMicrophoneSlashFill } from "react-icons/pi";
import { FaHeadphones } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbHeadphonesOff } from "react-icons/tb";
import { useState } from "react";

const BottomProfile = () => {

    const [turnMicOff,setTurnMicOff] = useState<boolean>(false);
    const [turnHeadOff,setTurnHeadOff] = useState<boolean>(false);
    const [openSettings,setOpenSettings] = useState<boolean>(false);


    
  return (
    <div className='w-full h-16 bg-[#232428] mt-auto p-3 relative'>
        <div className='w-full h-full flex '>
         <div className='flex w-full gap-3'>
         <div className='w-[20%] h-full flex justify-center'>
            <img className='w-10 h-10 rounded-full' src="https://i.pinimg.com/1200x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg" alt="" />
          </div>
          <div className='text-white w-auto max-w-12 flex items-center'>
            <p>Ayhan</p>
          </div>
         </div>
          <div className='flex  text-white text-xl gap-3 items-center'>
            {
              !turnMicOff ? <FaMicrophone onClick={()=>setTurnMicOff(!turnMicOff)} className='cursor-pointer' /> :
              <PiMicrophoneSlashFill onClick={()=>setTurnMicOff(!turnMicOff)} className='cursor-pointer text-red-600' />
            }
            {
              !turnHeadOff ? <FaHeadphones  onClick={()=>setTurnHeadOff(!turnHeadOff)} className='cursor-pointer' /> :
              <TbHeadphonesOff onClick={()=>setTurnHeadOff(!turnHeadOff)} className='cursor-pointer text-red-600' />
            }
            <IoMdSettings onClick={()=>setOpenSettings(!openSettings)} className='cursor-pointer' />
          </div>
        </div>
        {
          openSettings && 
          <div className="absolute w-full h-24 bg-black bottom-16 right-0">opened</div>
        }
      </div>
  )
}

export default BottomProfile
