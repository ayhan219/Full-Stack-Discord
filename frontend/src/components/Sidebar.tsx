import discordPNG from "../assets/pngegg.png"

const Sidebar = () => {
  return (
    <div className='w-24 h-screen bg-[#1E1F22]'>
      <div className="w-full h-auto flex justify-center pt-2">
        <img className=" w-16 h-16 object-cover cursor-pointer " src={discordPNG} alt="" />
      </div>
    </div>
  )
}

export default Sidebar
