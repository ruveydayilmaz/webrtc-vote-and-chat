"use client";

import React from "react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface LoginFormProps {
  username: string;
  room: string;
  setUsername: (username: string) => void;
  setRoom: (room: string) => void;
  handleJoinRoom: () => void;
}

export default function LoginForm({
  username,
  room,
  setUsername,
  setRoom,
  handleJoinRoom,
}: LoginFormProps) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="w-full max-w-sm space-y-4 p-4">
        <h1 className="text-2xl font-bold text-white text-center">
          Join a Room
        </h1>
        <Input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white"
        />
        <Input
          type="text"
          placeholder="Enter room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white"
        />
        <Button onClick={handleJoinRoom} className="w-full bg-blue-500">
          Join Room
        </Button>
      </div>
    </div>
  );
}
