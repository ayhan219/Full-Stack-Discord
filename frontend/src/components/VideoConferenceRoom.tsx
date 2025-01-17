import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';

import '@livekit/components-styles';

import { Track } from 'livekit-client';
import { useUserContext } from '../context/UserContext';


const serverUrl = 'wss://discord-clone-6tnm5nqn.livekit.cloud';

export default function App() {
  const { token, setConnectedToVoice, connectedToVoice,setHandleDisconnect } = useUserContext();

  // Handle the LiveKit room events (connected and disconnected)
  const handleConnected = () => {
    setConnectedToVoice(true);
  };

  const handleDisconnected = () => {
    setConnectedToVoice(false);
    setHandleDisconnect(true);
  };

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      connect={true}
      token={token}
      serverUrl={serverUrl}
      data-lk-theme="default"
      style={{ height: '100vh' }}
      onConnected={handleConnected}        
      onDisconnected={handleDisconnected}  
    >
      {/* Your custom component with basic video conferencing functionality. */}
      <MyVideoConference />
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      <RoomAudioRenderer />
      {/* Controls for the user to start/stop audio, video, and screen
      share tracks and to leave the room. */}
      <ControlBar />
    </LiveKitRoom>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false },
  );
  return (
    <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
