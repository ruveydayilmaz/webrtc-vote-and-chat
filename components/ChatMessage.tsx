"use client";

import React from "react";

import { Avatar, AvatarFallback } from "./ui/avatar";

interface ChatMessageProps {
  isOwnMessage: boolean;
  sender: string;
  message: string;
}

export default function ChatMessage({
  isOwnMessage,
  sender,
  message,
}: ChatMessageProps) {
  const isSystemMessage = sender === "system";

  return (
    <div className={`flex space-x-2 ${isSystemMessage ? "justify-center" : isOwnMessage ? "justify-end" : "justify-start"} mb-3`}>
        {!isSystemMessage && !isOwnMessage &&
          <Avatar className="h-6 w-6 bg-zinc-700">
            <AvatarFallback>{sender[0]}</AvatarFallback>
          </Avatar>
        }

      <div
        className={`max-w-md pl-4 pr-6 py-1 rounded-xl ${isSystemMessage
          ? "bg-zinc-800 text-zinc-300 text-center text-sm"
          : isOwnMessage
            ? "bg-zinc-800 text-white"
            : "bg-blue-500 text-white"
          }`}
      >
        {!isSystemMessage && <p className="text-xs font-medium opacity-80">{sender}</p>}
        <p className="break-words">{message}</p>
      </div>
    </div>
  );
}
