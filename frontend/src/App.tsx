import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Channel from "./pages/Channel";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useUserContext } from "./context/UserContext";
import FriendChat from "./pages/FriendChat";
import Profile from "./pages/Profile";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";



function App() {
  const { user,token } = useUserContext();
  const serverUrl = "wss://discord-clone-6tnm5nqn.livekit.cloud";

  return (
    <BrowserRouter>
    <LiveKitRoom
        video={true}
        audio={true}
        connect={true}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <RoomAudioRenderer />
        
      
      {/* <div className='flex'>
  
  </div> */}
      <div className="flex">
        {user && (
          <Sidebar
          />
        )}
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/channel" element={<Channel />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/friendchat" element={<FriendChat />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      </LiveKitRoom>
    </BrowserRouter>
  );
}

export default App;
