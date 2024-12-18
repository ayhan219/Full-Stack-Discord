import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Channel from "./pages/Channel";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useUserContext } from "./context/UserContext";
import FriendChat from "./pages/FriendChat";


function App() {
  const [activeChannel, setActiveChannel] = useState<string>("home");
  const { user } = useUserContext();

  return (
    <BrowserRouter>
      {/* <div className='flex'>
  
  </div> */}
      <div className="flex">
        {user && (
          <Sidebar
            setActiveChannel={setActiveChannel}
            activeChannel={activeChannel}
          />
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/channel" element={<Channel />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/friendchat" element={<FriendChat />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
