"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ChatFormProps {
  onSendMessage: (message: string) => void;
}

export default function ChatForm({ onSendMessage }: ChatFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-zinc-800 border-zinc-700 text-white rounded-full"
      />
      <Button
        type="submit"
        size="icon"
        className="text-blue-500 hover:text-blue-900"
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
