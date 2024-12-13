import dcbackgroung from "../assets/discordback.png";

const Signup = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${dcbackgroung})` }}
    >
      <div className="w-[600px] h-auto bg-[#2f3136] rounded-lg shadow-lg p-6">
        <div className="w-full h-auto text-white font-bold text-3xl flex justify-center py-4">
          <h3>Create an account</h3>
        </div>

       
        <div className="w-full h-auto">
          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">EMAIL</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className="w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white "
                type="email"
              />
            </div>
          </div>

          
          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">DISPLAY NAME</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className="w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white"
                type="text"
              />
            </div>
          </div>

          
          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">USERNAME</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className="w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white "
                type="text"
              />
            </div>
          </div>

         
          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">PASSWORD</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className="w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white "
                type="password"
              />
            </div>
          </div>

          
          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">CONFIRM PASSWORD</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className="w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white "
                type="password"
              />
            </div>
          </div>
          <div className="w-full h-12 flex items-center px-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="hidden peer"
                id="discord-checkbox"
              />
              <span
                className="w-6 h-6 border-2 border-gray-500 rounded-sm flex items-center justify-center 
      transition-colors duration-300 ease-in-out 
      peer-checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-400"
              >
                <svg
                  className="w-4 h-4 text-white opacity-0 transition-opacity duration-300 ease-in-out peer-checked:opacity-100"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.293 5.293a1 1 0 010 1.414L9 13.414l-3.707-3.708a1 1 0 111.414-1.414L9 10.586l6.879-6.879a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <span className="ml-3 text-white text-sm">
                I agree to the{" "}
                <a href="#" className="text-blue-400 underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-400 underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          
          <div className="w-full h-auto flex justify-center py-4">
            <button className="w-[90%] h-12 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition duration-300">
              Sign Up
            </button>
          </div>

         
          <div className="w-full h-auto text-center mt-4 text-sm text-gray-400">
            <p>
              Already have an account?{" "}
              <a href="/login" className="text-blue-400 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Signup;
