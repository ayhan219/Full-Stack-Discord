import { useState } from "react";
import dcbackgroung from "../assets/discordback.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);

  const [displayName, setDisplayName] = useState<string>("");
  const [isDisplayNameValid, setIsDisplayNameValid] = useState<boolean>(true);

  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);

  const [password, setPassword] = useState<string>("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);

  const [rePassword, setRePassword] = useState<string>("");
  const [isPasswordMatching, setIsPasswordMatching] = useState<boolean>(false);

  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);

  const handleEmail = (emailInput: string) => {
    setEmail(emailInput);
    const hasValidInput =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput);
    setIsEmailValid(hasValidInput);
  };

  const handleDisplayName = (displayNameInput: string) => {
    setDisplayName(displayNameInput);
    const hasValidInput = displayNameInput.length >= 6;
    setIsDisplayNameValid(hasValidInput);
  };

  const handleUsername = (usernameInput: string) => {
    setUsername(usernameInput);
    const hasValidInput1 = username.length >= 6;
    const hasValidInput2 = /\d/.test(usernameInput);
    setIsUsernameValid(hasValidInput1 && hasValidInput2);
  };

  const handlePassword = (passwordInput: string) => {
    setPassword(passwordInput);
    const hasValidPassword =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/.test(
        passwordInput
      );
    setIsPasswordValid(hasValidPassword);
  };

  const handleRePassword = (rePasswordInput: string) => {
    setRePassword(rePasswordInput);
    if (rePasswordInput === password) {
      setIsPasswordMatching(true);
    } else {
      setIsPasswordMatching(false);
    }
  };

  const handleCheckboxChange = () => {
    setIsTermsChecked(!isTermsChecked);
  };

  const handleSubmit = async () => {
    if (
      isEmailValid &&
      isDisplayNameValid &&
      isUsernameValid &&
      isPasswordValid &&
      isPasswordMatching &&
      isTermsChecked
    ) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/signup",
          {
            email,
            displayName,
            username,
            password,
          }
        );
        if(response.status===200){
          navigate("/login")
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("error");
    }
  };

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
                className={`w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white ${
                  !isEmailValid && email !== "" && "border border-red-600"
                } `}
                type="email"
                onChange={(e) => handleEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">DISPLAY NAME</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className={`w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white ${
                  !isDisplayNameValid &&
                  displayName !== "" &&
                  "border border-red-600"
                }`}
                type="text"
                onChange={(e) => handleDisplayName(e.target.value)}
                value={displayName}
              />
            </div>
          </div>

          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">USERNAME</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className={`w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white ${
                  !isUsernameValid && username !== "" && "border border-red-600"
                }`}
                type="text"
                onChange={(e) => handleUsername(e.target.value)}
                value={username}
              />
            </div>
          </div>

          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">PASSWORD</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className={`w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white ${
                  !isPasswordValid && password !== "" && "border border-red-600"
                }`}
                type="password"
                onChange={(e) => handlePassword(e.target.value)}
                value={password}
              />
            </div>
          </div>

          <div className="w-full h-auto text-white font-medium flex flex-col p-4">
            <label className="px-7 text-sm">CONFIRM PASSWORD</label>
            <div className="w-full h-auto flex items-center justify-center">
              <input
                className={`w-[90%] h-10 rounded-sm bg-[#1E1F23] outline-none text-white ${
                  !isPasswordMatching &&
                  rePassword !== "" &&
                  "border border-red-600"
                } `}
                type="password"
                onChange={(e) => handleRePassword(e.target.value)}
                value={rePassword}
              />
            </div>
          </div>
          <div className="w-full h-12 flex items-center px-8">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="hidden peer"
                id="discord-checkbox"
                checked={isTermsChecked}
                onChange={handleCheckboxChange}
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
            <button
              onClick={() => handleSubmit()}
              className="w-[90%] h-12 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition duration-300"
            >
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
