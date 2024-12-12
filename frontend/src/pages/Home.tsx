
import Menu from '../components/Menu'
import TopBar from '../components/TopBar'
import { IoMdSearch } from "react-icons/io";

const Home = () => {
  return (
    <div className='w-full flex bg-[#313338]'>
      <Menu />
      <div className='flex flex-col w-full'>
      <TopBar />
      <div className='w-[70%] h-12 flex  items-center m-3 relative '>
        <div className='w-full h-[70%] relative'>
        <input className='w-full h-full bg-[#1E1F22] rounded-lg pl-2 outline-none text-white' placeholder='Search' type="text" />
        <IoMdSearch className='absolute text-2xl text-gray-400 right-0 bottom-1 mr-1' />
        </div>
      </div>
      </div>
      
    </div>
  )
}

export default Home
