# Discord Clone

# 🌍 The code still has some bugs(fixing) 

This project is a **Discord Clone** developed using **React**, **TypeScript**, **Node.js**, **Express.js**, **MongoDB**, **Socket.IO**, and **LiveKit** for voice communication. The app allows users to chat in real-time, join voice channels, and send direct messages, simulating a Discord-like experience.

## Features

- **Real-time Messaging**: Users can send and receive messages in real-time, similar to Discord's chat functionality.
- **Voice Channels**: Integrated **LiveKit** allows users to join voice channels and communicate via voice.
- **Socket.IO**: Real-time bidirectional event-based communication for sending and receiving messages instantly.
- **User Authentication**: Users can log in, register, and manage their profiles.
- **Responsive Design**: The app is fully responsive and works across multiple screen sizes.

## Tech Stack

- **Frontend**: React (with TypeScript)
- **Backend**: Node.js, Express.js
- **Real-Time Communication**: Socket.IO for messaging, LiveKit for voice chat
- **Database**: MongoDB (for storing user data and messages)
- **Styling**: Tailwind for custom styling

## Installation

### 1. Clone the repository

First, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/ayhan219/Full-Stack-Discord.git
```

### 2. Install dependencies for the frontend,backend and socket

```bash
cd (frontend,backend,socket)
npm install
```

### 4. Configure environment variables

```bash
MONGODB_URI=your-mongodb-uri
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_SECRET=your-livekit-secret
```

### 5. Run the development servers

```bash
npm run dev
```


### 1. **Real-Time Communication with Socket.IO**

One of the core features of the application is the use of **Socket.IO** to enable real-time, bidirectional communication. **Socket.IO** allows for instant updates between the server and clients, making it perfect for a chat application like this one. The primary use of Socket.IO in this project is to handle:

- **User Online/Offline Status**: When a user logs in, their status is sent to the server, allowing the application to track and update whether the user is online or offline. This status is then broadcast to other users in the system, ensuring that everyone in the app is aware of who is available at any given moment.
  
- **Real-Time Messaging**: The chat feature itself is powered by **Socket.IO**, so messages are instantly delivered to the relevant user without requiring a page reload. This ensures a seamless and interactive user experience.

### 2. **User Authentication with Cookies**

User authentication in this project is handled using **cookies**. When a user logs in, a **JWT (JSON Web Token)** is generated on the server and stored in the browser's cookies. This allows users to stay authenticated across page reloads, keeping them logged in even if they refresh the page or return later. The key benefits of this approach are:

- **Persistence**: As long as the user's cookie remains valid, they stay logged in, which enhances the user experience by avoiding frequent logins.

- **Security**: Cookies are securely handled and can be set with **HttpOnly** and **Secure** flags, making them resistant to client-side script access and protecting them during transmission over **HTTPS**.

When a user logs in, an **online status** event is triggered and sent to the server, updating the user's availability to all other connected clients in real-time.

### 3. **Voice and Video Communication with LiveKit**

To enhance communication beyond text, this project integrates **LiveKit** for **voice** and **video calls**. **LiveKit** provides the foundation for real-time audio and video streaming, enabling users to:

- **Join Voice Channels**: Users can join different voice channels to chat in real-time, similar to how users interact on Discord.

- **Video Calls**: The app also allows for **video communication** within channels, allowing users to communicate more personally with their video or microphone turned on.

- **Screen Sharing**: Users have the option to **share their screen**, which is particularly useful for collaborations or presentations within the app. **LiveKit** manages the real-time broadcasting of screen content to all participants in the channel.

### 4. **Channel Management and User Interaction**

- **Kick Users from Channel**: As part of managing the community, the application allows users with appropriate privileges to **kick** other users from the voice channel. This feature is especially useful for moderators who need to control the conversation or manage disruptive behavior within a channel.

- **Dynamic Channel Updates**: Channels in this application are dynamically updated using **Socket.IO**. When a user joins or leaves a channel, all other participants are instantly notified of the change, ensuring everyone stays in sync.

### 5. **Real-Time Online Status Tracking**

Using **Socket.IO**, the app constantly tracks which users are currently online and sends the status updates across all connected clients. This enables users to:

- See whether their friends or colleagues are online or offline.
- Receive immediate feedback when their status changes, such as when they log in or out.



<br>

## Project Images

#### Home Page

![image](https://github.com/user-attachments/assets/7daa6bf9-bf81-4f48-b2a4-3fd49f198e3c)

#### Channel Page

![image](https://github.com/user-attachments/assets/9cffb5c3-683e-4720-b0e0-a341e21528d5)


#### Channel when user connected to voice

![image](https://github.com/user-attachments/assets/fafbc1ea-ccd4-4c9a-9ece-ffffefe040fe)


#### Channel settings area

![image](https://github.com/user-attachments/assets/d5a306eb-e32a-48b2-9605-988808d16fe4)




