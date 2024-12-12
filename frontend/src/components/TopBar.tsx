import React from 'react'
import { FaUserFriends } from "react-icons/fa";

const TopBar = () => {
  return (
    <div className='w-full h-12  bg-[#313338] px-10  border-b-2 border-gray-800 flex'>
        <div className='w-36 h-full text-gray-400 font-semibold flex items-center gap-3 '>
            <FaUserFriends className='text-3xl' />
            <h3 className='text-lg text-white'>Friends</h3>
            <div className='w-[0.13px] h-[40%] bg-gray-300'>
            </div>
        </div>
        <div className='w-full h-full px-10 flex'>
            <div className='text-gray-400 font-semibold flex items-center cursor-pointer gap-10'>
            <a>Online</a>
            <a>All</a>
            <a>Pending</a>
            <a>Suggestions</a>
            <a>Blocked</a>
            <div className='w-auto h-auto'>
                <button className='bg-green-800 w-24 h-8 rounded-lg text-white'>Add Friend</button>
            </div>
            </div>
        </div>
        
    </div>
  )
}

export default TopBar
