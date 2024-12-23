import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

type User = {
  userId: string;
  email: string;
  displayName: string;
  username: string;
  profilePic: string;
  friends: Friend[];
  pendingFriend: Friend[];
  menuChat: Friend[];
};

interface Friend {
  username: string;
  _id: string;
  profilePic: string;
}

const Profile = () => {
  const { user,setUser } = useUserContext();

  const [userEmailWithPrivate, setUserEmailWithPrivate] = useState<string>("");

  const handleEmail = () => {
    if (!user?.email) {
      return;
    }

    const index = user.email.indexOf("@");
    const getPartOfEmail = user.email.slice(0, index);
    const result = getPartOfEmail?.replace(/./g, "*");

    const findAfterAt = user.email.slice(index, user?.email.length);
    const finalValue = result.concat(findAfterAt);
    setUserEmailWithPrivate(finalValue);
  };

  useEffect(() => {
    if (user) {
      handleEmail();
    }
  }, [user]);

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId",user?.userId || "")

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/upload-profile",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if(response.status===200){
        setUser((prev)=>{
          if(!prev){
            return prev;
          }
          return{
            ...prev,
            profilePic:response.data.profilePic
          }
        })
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };
  return (
    <div className="w-full h-screen bg-[#313338] flex flex-col items-center p-10 gap-10 ">
      <div className="w-full flex justify-center text-white font-bold text-2xl">
        <h3>My Account</h3>
      </div>
      <div className="w-[600px] h-[600px] bg-[#1E1F22] flex flex-col items-center rounded-lg">
        <div className="w-full h-auto flex items-center justify-between p-8">
          <div className="w-64 h-auto flex items-center gap-5 ">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-800 cursor-pointer"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <img
                className="w-16 h-16 rounded-full"
                src={`http://localhost:5000${user?.profilePic}`}
                alt=""
              />
            </div>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleProfileImageChange}
            />

            <div className="text-white font-bold">
              <h2>{user?.username}</h2>
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
                <h3>{user?.displayName}</h3>
              </div>
            </div>
            <div className="w-auto h-full flex items-center">
              <button className="w-16 h-10 bg-gray-600 text-white rounded-sm ">
                Edit
              </button>
            </div>
          </div>

          <div className="w-full h-16 p-5 flex justify-between items-center">
            <div className="w-auto flex flex-col gap-3">
              <div className="text-[#A8BAC1] font-semibold">
                <p>USERNAME</p>
              </div>
              <div className="text-white">
                <h3>{user?.username}</h3>
              </div>
            </div>
            <div className="w-auto h-full flex items-center">
              <button className="w-16 h-10 bg-gray-600 text-white rounded-sm ">
                Edit
              </button>
            </div>
          </div>

          <div className="w-full h-16 p-5 flex justify-between items-center">
            <div className="w-auto flex flex-col gap-3">
              <div className="text-[#A8BAC1] font-semibold">
                <p>EMAIL</p>
              </div>
              <div className="text-white">
                <h3>{userEmailWithPrivate}</h3>
              </div>
            </div>
            <div className="w-auto h-full flex items-center">
              <button className="w-16 h-10 bg-gray-600 text-white rounded-sm ">
                Edit
              </button>
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
              <button className="w-16 h-10 bg-gray-600 text-white rounded-sm ">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center text-white font-bold text-2xl flex-col gap-3 ">
        <h3>Password And Authentication</h3>
        <div className="w-40 h-8 text-white font-semibold text-sm rounded-md flex items-center justify-center bg-[#4752C4] ">
          <button>Edit Password</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
