import { useState } from "react";
import dcbackgroung from "../assets/discordback.png";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const { setUser, url, socket } = useUserContext();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${url}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setUser(response.data);

      if (response.status === 200) {
        const userIds = response.data.friends.map((friend: any) => friend);
        const senderData = {
          _id: response.data.userId,
          username: response.data?.username,
          profilePic: response.data?.profilePic,
        };
        socket.emit("getOnlineUser", {
          userIds: userIds,
          senderId: senderData,
        });
        toast.success("Login successfull!")
        navigate("/home");
      }
    } catch (error) {
      toast.error("Error while login")
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${dcbackgroung})` }}
    >
      <div className=" w-[350px] sm:w-[500px] md:w-[600px] h-auto bg-[#2f3136] rounded-lg shadow-lg p-6">
        <div className="w-full h-auto text-white font-bold text-3xl flex justify-center py-4">
          <h3>Login</h3>
        </div>
        <div className="w-full h-auto">
          <div className="w-full h-auto text-white font-medium flex flex-col gap-2 p-4">
            <label className="px-4 md:px-7 text-xs md:text-sm">EMAIL</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className="w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white "
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          <div className="w-full  text-white font-medium flex flex-col gap-2 p-4">
            <label className="px-4 md:px-7 text-xs md:text-sm">PASSWORD</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className="w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white "
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>

          <div className="w-full h-auto flex justify-center py-4">
            <button
              onClick={() => handleLogin()}
              className="w-[90%] h-12 bg-blue-500 text-white rounded-sm !text-sm !md:text-base hover:bg-blue-600 transition duration-300"
            >
              Login
            </button>
          </div>

          <div className="w-full h-auto text-center mt-4 text-sm text-gray-400">
            <p>
              You don't have an account?{" "}
              <a href="/signup" className="text-blue-400 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
