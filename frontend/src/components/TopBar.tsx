import React, { act, useState } from 'react'
import { FaUserFriends } from "react-icons/fa";


const TopBar = () => {

    const [activeTopBarMenu,setActiveTopBarMenu] = useState<string>("online");


    


    function handleActiveMenu(activeMenu: string): void {
       setActiveTopBarMenu(activeMenu);

    }

  return (
    <div className='w-full h-12  bg-[#313338] px-10  border-b-2 border-gray-800 flex'>
        <div className='w-36 h-full text-gray-400 font-semibold flex items-center gap-3 '>
            <FaUserFriends className='text-3xl' />
            <h3 className='text-lg text-white'>Friends</h3>
            <div className='w-[0.13px] h-[40%] bg-gray-300'>
            </div>
        </div>
        <div className=' w-[70%] md:w-full h-full px-10 flex'>
            <div className='text-gray-400 font-semibold hidden md:flex items-center cursor-pointer gap-10 text-base'>
            <a onClick={()=>handleActiveMenu("online")} className={`w-auto max-w-28 h-6 text-center ${activeTopBarMenu === "online" && " bg-[#44474d] rounded-sm text-white" }`}>Online</a>
            <a onClick={()=>handleActiveMenu("all")} className={`w-auto h-6 text-center ${activeTopBarMenu === "all" && " bg-[#44474d] rounded-sm text-white" }`}>All</a>
            <a onClick={()=>handleActiveMenu("pending")} className={`w-auto h-6 text-center ${activeTopBarMenu === "pending" && " bg-[#44474d] rounded-sm text-white" }`}>Pending</a>
            <a onClick={()=>handleActiveMenu("suggestions")} className={`w-auto h-6 text-center ${activeTopBarMenu === "suggestions" && " bg-[#44474d] rounded-sm text-white" }`}>Suggestions</a>
            <a onClick={()=>handleActiveMenu("blocked")} className={`w-auto h-6 text-center ${activeTopBarMenu === "blocked" && " bg-[#44474d] rounded-sm text-white" }`}>Blocked</a>
            <div className='w-auto h-auto'>
                <button className='bg-green-800 w-24 h-8 rounded-lg text-white'>Add Friend</button>
            </div>
            </div>
        </div>
        
    </div>
  )
}

export default TopBar
