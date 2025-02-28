# Real-Time WebRTC Voting & Audio Chat App  

A real-time WebRTC-powered application that enables users to join rooms, communicate via voice&text, and vote on topics using WebRTC Data Channels with a Socket.io fallback.  

---

## Project Structure  

```
/app
│── /hooks           # Custom React hooks (e.g., useMessage, useWebRTC, useSocket, useVoting)
│── global.css       # Global styles for the application
│── layout.tsx       # Main layout component for the application
│── page.tsx         # Main page component (handles the primary route of the app)
/components          # Reusable UI components (buttons, inputs, etc.)
/lib                 # Utility functions and libraries (e.g., socketClient, helper utils)
/public              # Static files (images etc.) served publicly
server.mts           # Backend server code (handles Socket.io logic)
tsconfig.server.json # TypeScript configuration specific to the server-side build
```

---

## How to Run the Application Locally  

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/ruveydayilmaz/webrtc-vote-and-chat.git
cd webrtc-vote-and-chat
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Start the Development Server**
You have to use `npm run dev:socket` to run both the backend and the frontend. This is important.
```sh
npm run dev:socket
```

---

## Key Concepts Used  

### **1️⃣ WebRTC APIs**
- `RTCPeerConnection` for establishing peer-to-peer connections.
- `RTCDataChannel` for exchanging votes and real-time data.
- `onicecandidate` for gathering ICE candidates.
- `ontrack` for handling incoming audio streams.

### **2️⃣ Signaling with Socket.io**
- Used to exchange WebRTC connection details between peers.
- Handles session initiation, ICE candidates, and connection negotiation.

### **3️⃣ Real-time Data Exchange**
- Voting uses **WebRTC Data Channels** (preferred) or **Socket.io** (fallback).

---

## Packages Used  

| Package         | Version |
|----------------|---------|
| `class-variance-authority` | ^0.7.1 |
| `lucide-react` | ^0.476.0 |
| `next` | 15.1.7 |
| `react` | ^19.0.0 |
| `react-dom` | ^19.0.0 |
| `socket.io` | ^4.8.1 |
| `socket.io-client` | ^4.8.1 |
| `tailwindcss` | ^3.4.1 |
| `tailwind-merge` | ^3.0.2 |
| `ts-node` | ^10.9.2 |
| `webrtc-adapter` | ^9.0.1 |
| `typescript` | ^5 |

---

## Feature TODO  

- [x] Real-time audio and text chat  
- [x] WebRTC-based voting system  
- [x] Fallback to Socket.io when WebRTC fails  
- [ ] Support for video calls  
- [ ] User authentication  
- [ ] Security: [Securing Socket.io](https://www.linkedin.com/pulse/securing-your-socketio-chat-apis-best-practices-guide-aakarshit-giri-kxekc/)

---

## Error Handling  

### **Frontend:**
- **Microphone Permission Denied**: Alerts the user and prevents joining calls.
- **WebRTC Connection Failure**: Displays an error message and retries.
- **Socket Disconnection**: Attempts reconnection with exponential backoff.
...

### **Backend:**
- **Connection Failures**: Emits an `"error"` event to notify clients.
- **Invalid Data**: Returns error responses for malformed requests.
- **Room Management Errors**: Prevents duplicate rooms or invalid room IDs.
...

---

## Socket.io Backend  

### **Events Overview**
| Event | Description |
|-------|-------------|
| `offer` | Sends WebRTC offer |
| `answer` | Sends WebRTC answer |
| `ice-candidate` | Sends ICE candidate |
| `vote` | Sends a vote to other clients |
| `reset-votes` | Resets all votes |
| `join-voice` | Registers a user in a voice room |
| `join-room` | Registers a user in a room |
| `leave-call` | Removes a user from a voice room |
| `message` | Sends a message to a room |
| `error` | Notifies clients of any server errors |

---

## License  

MIT License © 2025 ruveydayilmaz

---

## Demo
![Screenshot](https://github.com/user-attachments/assets/59e62d8d-2653-4cba-b59f-389869d18aad)
**You can check out the demo here: [Demo](test-delta-ruddy-56.vercel.app). However, as shown in the image above, it is not always reliable and may not work consistently. For the best experience, please run the project locally.**  

https://github.com/user-attachments/assets/90936e24-b2f3-4cd8-8458-4e1a5eefe603
