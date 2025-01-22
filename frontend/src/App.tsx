import { ReactNode } from "react";
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

// PrivateRoute bileşeni
interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useUserContext();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  const { user, token } = useUserContext();
  const serverUrl = "wss://discord-clone-6tnm5nqn.livekit.cloud";

  return (
    <BrowserRouter>
      <LiveKitRoom
        video={true}
        audio={true}
        connect={!!user}
        token={token}
        serverUrl={serverUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
      >
        <RoomAudioRenderer />
        <div className="flex">
          {user && <Sidebar />}
          <Routes>
            {/* Genel Rotalar */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Korunan Rotalar */}
            <Route
              path="/channel"
              element={
                <PrivateRoute>
                  <Channel />
                </PrivateRoute>
              }
            />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/friendchat"
              element={
                <PrivateRoute>
                  <FriendChat />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </LiveKitRoom>
    </BrowserRouter>
  );
}

export default App;
