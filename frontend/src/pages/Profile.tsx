
const Profile = () => {
    return (
      <div className="w-full h-screen bg-[#313338] flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-[#1E1F22] flex flex-col items-center rounded-lg">
            <div className="w-full h-auto flex items-center justify-between p-8">
                <div className="w-64 h-auto flex items-center gap-5 ">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-800 ">
                    <img className="w-16 h-16 rounded-full" src="https://i.pinimg.com/1200x/98/1d/6b/981d6b2e0ccb5e968a0618c8d47671da.jpg" alt="" />
                </div>
                <div className="text-white font-bold">
                    <h2>Ayhan</h2>
                </div>
                </div>
                <div className="w-40 h-8 text-white font-semibold text-sm rounded-md flex items-center justify-center bg-[#4752C4] ">
                    <button>Edit User Profile</button>
                </div>
            </div>
            <div className="w-[95%] h-[72%] bg-[#2B2D31] rounded-lg flex flex-col gap-3 justify-evenly   ">
                <div className="w-full h-16 p-5 flex justify-between items-center">
                    <div className="w-auto flex flex-col gap-3">
                    <div className="text-[#A8BAC1] font-semibold">
                        <p>DISPLAY NAME</p>
                    </div>
                    <div className="text-white">
                        <h3>Ayhan</h3>
                    </div>
                    </div>
                    <div className="w-auto h-full flex items-center">
                        <button className="w-16 h-10 bg-gray-600 text-white rounded-sm ">Edit</button>
                    </div>
                </div>


                <div className="w-full h-16 p-5 flex justify-between items-center">
                    <div className="w-auto flex flex-col gap-3">
                    <div className="text-[#A8BAC1] font-semibold">
                        <p>USERNAME</p>
                    </div>
                    <div className="text-white">
                        <h3>Ayhan219</h3>
                    </div>
                    </div>
                    <div className="w-auto h-full flex items-center">
                        <button className="w-16 h-10 bg-gray-600 text-white rounded-sm ">Edit</button>
                    </div>
                </div>

                <div className="w-full h-16 p-5 flex justify-between items-center">
                    <div className="w-auto flex flex-col gap-3">
                    <div className="text-[#A8BAC1] font-semibold">
                        <p>EMAIL</p>
                    </div>
                    <div className="text-white">
                        <h3>*********@gmail.com</h3>
                    </div>
                    </div>
                    <div className="w-auto h-full flex items-center">
                        <button className="w-16 h-10 bg-gray-600 text-white rounded-sm ">Edit</button>
                    </div>
                </div>

                <div className="w-full h-16 p-5 flex justify-between items-center">
                    <div className="w-auto flex flex-col gap-3">
                    <div className="text-[#A8BAC1] bold-semibold">
                        <p>PHONE NUMBER</p>
                    </div>
                    <div className="text-white">
                        <h3>********1413</h3>
                    </div>
                    </div>
                    <div className="w-auto h-full flex items-center">
                        <button className="w-16 h-10 bg-gray-600 text-white rounded-sm ">Edit</button>
                    </div>
                </div>



                
            </div>

        </div>
        
      </div>
    )
  }
  
  export default Profile
  