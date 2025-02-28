import { useEffect, useState } from "react";

import { useSocket } from "./useSocket";

export const useMessage = (room: string, username: string) => {
  const { socket, emitEvent } = useSocket();

  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [voiceChatUsers, setVoiceChatUsers] = useState<string[]>([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("message", (data) => setMessages((prev) => [...prev, data]));
    socket.on("user_joined", (message) => setMessages((prev) => [...prev, { sender: "system", message }]));
    socket.on("user_list", (userList) => setUsers(userList));
    socket.on("voice_chat_list", (voiceChatList) => setVoiceChatUsers(voiceChatList));

    return () => {
      socket.off("message");
      socket.off("user_joined");
      socket.off("user_list");
      socket.off("voice_chat_list");
    };
  }, []);

  const sendMessage = (message: string) => {
    const data = { room, message, sender: username };
    setMessages((prev) => [...prev, { sender: username, message }]);
    emitEvent("message", data);
  };

  const joinRoom = () => {
    emitEvent("join-room", { room, username });
    setJoined(true);
  };

  return { messages, users, voiceChatUsers, joined, sendMessage, joinRoom };
};
