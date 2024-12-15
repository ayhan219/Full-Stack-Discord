import { useState } from "react";
import dcbackgroung from "../assets/discordback.png";
import axios from "axios"
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [email,setEmail] = useState<string>("");
  const [password,setPassword] = useState<string>("");

  const navigate = useNavigate();

  const {setUser} = useUserContext();


  const handleLogin = async()=>{
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login",{
        email,
        password
      },{
        withCredentials:true
        
      })
      console.log(response.data);
      setUser(response.data)
      
      if(response.status===200){
        navigate("/home");
      }
      
      
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${dcbackgroung})` }}
    >
      <div className="w-[600px] h-auto bg-[#2f3136] rounded-lg shadow-lg p-6">
      <div className="w-full h-auto text-white font-bold text-3xl flex justify-center py-4">
          <h3>Login</h3>
        </div>
        <div className="w-full h-auto">
          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">EMAIL</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className="w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white "
                type="email"
                onChange={(e)=>setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">PASSWORD</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className="w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white "
                type="password"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>

          <div className="w-full h-auto flex justify-center py-4">
            <button onClick={()=>handleLogin()} className="w-[90%] h-12 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition duration-300">
              Sign Up
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
