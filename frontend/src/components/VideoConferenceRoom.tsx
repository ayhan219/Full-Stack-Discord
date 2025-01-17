// VideoConferenceRoom.tsx
import {
    ControlBar,
    GridLayout,
    LiveKitRoom,
    ParticipantTile,
    RoomAudioRenderer,
    useTracks,
  } from '@livekit/components-react';
  
  import { Track } from 'livekit-client';
  
  const serverUrl = 'wss://discord-clone-6tnm5nqn.livekit.cloud';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzcwNzg3MTEsImlzcyI6IkFQSXFiRVdER2NBRG5ZbiIsIm5iZiI6MTczNzA3MTUxMSwic3ViIjoicXVpY2tzdGFydCB1c2VyIDFpbXlreSIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.pm-v83cWxJDYhdDjCRud9zza4fhGXSrkzA-rerwQZhs';
  
  const VideoConferenceRoom = () => {
    return (
      <LiveKitRoom
        video={false}
        audio={true}
        token={token}
        serverUrl={serverUrl}
        // Use the default LiveKit theme for nice styles.
        data-lk-theme="default"
        style={{ height: '100vh' }}
      >
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </LiveKitRoom>
    );
  };
  
  const MyVideoConference = () => {
    const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { onlySubscribed: false }
    );
    return (
      <GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
        <ParticipantTile />
      </GridLayout>
    );
  };
  
  export default VideoConferenceRoom;
  