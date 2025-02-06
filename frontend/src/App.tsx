import {useState } from "react";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Channel from "./pages/Channel";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useUserContext } from "./context/UserContext";
import FriendChat from "./pages/FriendChat";
import Profile from "./pages/Profile";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { ToastContainer } from "react-toastify";




function App() {
  const { user, token} =
    useUserContext();
  const serverUrl = "wss://discord-clone2-k8nlwhsb.livekit.cloud";
  const [isAreaOpen, setIsAreaOpen] = useState<boolean>(false);

  return (
    <BrowserRouter>
      <ToastContainer />
      <LiveKitRoom
        video={false}
        audio={true}
        connect={!!user}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <RoomAudioRenderer />
        <div className="flex">
          {user && (
            <Sidebar isAreaOpen={isAreaOpen} setIsAreaOpen={setIsAreaOpen} />
          )}
          <Routes>
            <Route
              path="/signup"
              element={
                  <Signup />
              }
            />
            <Route
              path="/login"
              element={
                  <Login />
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path="/channel/:id"
              element={
                  <Channel
                    isAreaOpen={isAreaOpen}
                    setIsAreaOpen={setIsAreaOpen}
                  />
              }
            />
            <Route
              path="/home"
              element={
                  <Home isAreaOpen={isAreaOpen} setIsAreaOpen={setIsAreaOpen} />
              }
            />
            <Route
              path="/friendchat/:id"
              element={
                  <FriendChat
                    isAreaOpen={isAreaOpen}
                    setIsAreaOpen={setIsAreaOpen}
                  />
              }
            />
            <Route
              path="/profile"
              element={
                  <Profile />
              }
            />
          </Routes>
        </div>
      </LiveKitRoom>
    </BrowserRouter>
  );
}

export default App;
