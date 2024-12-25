import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { IoIosCloseCircle } from "react-icons/io";

const Profile = () => {
  const { user } = useUserContext();

  const [userEmailWithPrivate, setUserEmailWithPrivate] = useState<string>("");
  const [editSection, setEditSection] = useState<string | null>(null);
  const [newParam, setNewParam] = useState<string>("");

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

  

  return (
    <div className="w-full h-screen bg-[#313338] flex flex-col items-center p-10 gap-10">
      <div className="flex justify-center w-full text-2xl font-bold text-white">
        <h3>My Account</h3>
      </div>
      <div className="w-[600px] h-[600px] bg-[#1E1F22] flex flex-col items-center rounded-lg">
        <div className="flex items-center justify-between w-full h-auto p-8">
          <div className="flex items-center w-64 h-auto gap-5">
            <div
              className="flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full cursor-pointer"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <img
                className="w-16 h-16 rounded-full"
                src={`http://localhost:5000${user?.profilePic}`}
                alt=""
              />
            </div>
            <input type="file" id="fileInput" className="hidden" />
            <div className="font-bold text-white">
              <h2>{user?.username}</h2>
            </div>
          </div>
        </div>

        <div className="w-[95%] h-[72%] bg-[#2B2D31] rounded-lg flex flex-col gap-3 justify-evenly">
          {[
            { label: "DISPLAY NAME", value: user?.displayName, key: "displayName" },
            { label: "USERNAME", value: user?.username, key: "username" },
            { label: "EMAIL", value: userEmailWithPrivate, key: "email" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between w-full h-16 p-5"
            >
              <div className="flex flex-col w-auto gap-3">
                <div className="text-[#A8BAC1] font-semibold">
                  <p>{item.label}</p>
                </div>
                <div className="text-white">
                  {editSection === item.key ? (
                    <div className="relative w-full flex items-center">
                      <input
                        className="w-full h-10 bg-[#1E1F22] outline-none text-white p-3 font-semibold border border-gray-500 rounded-md focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder={item.value}
                        onChange={(e) => setNewParam(e.target.value)}
                        value={newParam}
                      />
                      <IoIosCloseCircle
                        className="absolute right-2 text-xl text-red-500 cursor-pointer hover:text-red-600"
                        onClick={() => setEditSection(null)}
                      />
                    </div>
                  ) : (
                    <h3>{item.value}</h3>
                  )}
                </div>
              </div>
              <div className="flex items-center w-auto h-full">
                <button
                  onClick={() =>
                    setEditSection(editSection === item.key ? null : item.key)
                  }
                  className={`w-16 h-10 ${
                    editSection === item.key ? "bg-red-500" : "bg-gray-600"
                  } text-white rounded-sm hover:opacity-80`}
                >
                  {editSection === item.key ? "Close" : "Edit"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
