"use client";

import { io } from "socket.io-client";

const ONE_SECOND = 1000;

// Initialize the socket connection
export const socket = io({
  reconnectionAttempts: 5, // Retry max 5 times
  timeout: 10 * ONE_SECOND, // 10 seconds timeout
  autoConnect: true,
});

// If your backend is running on a different server you have to specify the server URL,
// export const socket = io(process.env.NEXT_PUBLIC_SERVER, {
//   reconnectionAttempts: 5,
//   timeout: 10 * ONE_SECOND,
//   autoConnect: true,
// });
