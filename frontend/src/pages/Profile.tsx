import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { IoIosCloseCircle } from "react-icons/io";
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
  const { user, setUser } = useUserContext();

  const [userEmailWithPrivate, setUserEmailWithPrivate] = useState<string>("");
  const [editSection, setEditSection] = useState<string | null>(null);
  const [newParam, setNewParam] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleEmail = () => {
    if (!user?.email) return;

    const index = user.email.indexOf("@");
    const obfuscated = user.email.slice(0, index).replace(/./g, "*");
    setUserEmailWithPrivate(obfuscated + user.email.slice(index));
  };

  useEffect(() => {
    if (user) handleEmail();
  }, [user]);

  const handleEditProfile = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/edituserprofile", {
        userId: user?.userId,
        editedPartName: editSection,
        newParam,
      });
      if (response.status === 200) {
        setUser(response.data.user);
      }
      setEditSection(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfilePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", user?.userId || "");

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/upload-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setUser((prev: User | null) => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            profilePic: response.data.profilePic,
          };
        });
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[#2B2D31] flex flex-col items-center p-10 gap-10">
      <h3 className="text-4xl font-extrabold text-white mb-8">My Account</h3>
      <div className="w-[600px] h-auto bg-[#2F3136] flex flex-col items-center rounded-xl shadow-2xl p-8">
        {/* Profile Picture */}
        <div className="flex items-center justify-between w-full mb-8">
          <div className="flex items-center gap-6">
            <div
              className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden cursor-pointer relative hover:ring-4 hover:ring-blue-500 transition-all duration-300"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <img
                className="w-full h-full object-cover"
                src={`http://localhost:5000${user?.profilePic}`}
                alt="Profile"
              />
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </div>
            <h2 className="text-2xl font-semibold text-white">{user?.username}</h2>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="w-full bg-[#393C43] rounded-lg p-6 space-y-6">
          {[{ label: "Display Name", value: user?.displayName, key: "displayName" },
            { label: "Username", value: user?.username, key: "username" },
            { label: "Email", value: userEmailWithPrivate, key: "email" }]
            .map((item) => (
              <div key={item.key} className="flex justify-between items-center">
                <div className="w-3/4">
                  <p className="text-gray-400 text-sm font-medium">{item.label}</p>
                  {editSection === item.key ? (
                    <input
                      type="text"
                      className="w-full mt-1 p-3 text-white bg-[#202225] rounded-md border border-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
                      value={newParam}
                      onChange={(e) => setNewParam(e.target.value)}
                      placeholder={`Enter new ${item.label.toLowerCase()}`}
                    />
                  ) : (
                    <p className="text-white mt-1">{item.value}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {editSection === item.key ? (
                    <>
                      <button
                        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
                        onClick={handleEditProfile}
                      >
                        Save
                      </button>
                      <button
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-200"
                        onClick={() => setEditSection(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-blue-500 transition-all duration-200"
                      onClick={() => {
                        setEditSection(item.key);
                        setNewParam(item.value || "");
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
