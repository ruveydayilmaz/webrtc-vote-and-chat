"use client";

import { useState } from "react";
import {
  Settings,
  Radio,
  Plus,
  Vote,
  Mic,
  // Speaker,
  // Gem,
  MicOff,
  Minus,
} from "lucide-react";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";

interface SidebarProps {
  username: string;
  users: string[];
  voiceChatUsers: string[];
  inCall: boolean;
  remoteAudioRef: any;
  audioTrackRef: any;
  startCall: () => void;
  leaveCall: () => void;
}

export default function Sidebar({
  username,
  users,
  voiceChatUsers,
  startCall,
  remoteAudioRef,
  audioTrackRef,
  inCall,
  leaveCall,
}: SidebarProps) {
  const [micActive, setMicActive] = useState(true);

  const toggleMic = () => {
    if (audioTrackRef.current) {
      audioTrackRef.current.enabled = !audioTrackRef.current.enabled;
      setMicActive(audioTrackRef.current.enabled);
    }
  };

  const leave = () => {
    leaveCall();
    setMicActive(true);
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden flex flex-col items-center w-16 py-4 h-full overflow-hidden text-gray-400 bg-zinc-800 rounded">
        <Vote className="w-6 h-6 text-blue-500" />

        <div className="flex flex-col items-center mt-3 border-t border-gray-700">
          <Radio className="w-6 h-6 mt-2" />

          {/* WebRTC Audio */}
          {inCall ? (
            <Button
              onClick={leaveCall}
              variant="ghost"
              size="sm"
              className="px-2 text-red-400 hover:text-red-500"
            >
              Leave
            </Button>
          ) : (
            <Button
              onClick={startCall}
              variant="ghost"
              size="sm"
              className="px-2 text-zinc-400 hover:text-white"
            >
              Join
            </Button>
          )}

          <ScrollArea className="h-[120px]">
            <div className="py-2 space-y-4 flex-col items-center justify-center">
              {voiceChatUsers.map((user, index) => (
                <Avatar key={index} className="h-6 w-6">
                  <AvatarFallback>{user[0]}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </ScrollArea>
        </div>

        <button
          className={`mt-auto w-7 h-7 p-1 flex items-center justify-center relative rounded-full hover:bg-zinc-900/30 transition-all duration-100 ease-in-out ${
            !micActive ? "inactive-icon text-red-400" : "text-zinc-700"
          }`}
          onClick={toggleMic}
        >
          {micActive ? <Mic /> : <MicOff />}
        </button>
      </div>

      {/* Web Sidebar */}
      <div className="hidden md:flex w-64 bg-zinc-800 text-white p-4 flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Vote className="w-6 h-6 text-blue-500" />
            <div>
              <h1 className="font-semibold">VoteChat</h1>
              <p className="text-xs text-zinc-400">Chat and vote</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Radio className="w-4 h-4 mr-2" />
                <h2 className="text-xs font-semibold text-zinc-400">
                  VOICE CHAT
                </h2>
              </div>

              {/* WebRTC Audio */}
              {inCall ? (
                <Button
                  onClick={leave}
                  variant="ghost"
                  size="sm"
                  className="px-2 text-red-400 hover:text-red-500"
                >
                  <Minus className="w-3 h-3" /> Leave
                </Button>
              ) : (
                <Button
                  onClick={startCall}
                  variant="ghost"
                  size="sm"
                  className="px-2 text-zinc-400 hover:text-white"
                >
                  <Plus className="w-3 h-3" /> Join
                </Button>
              )}
            </div>
            <ScrollArea className="h-[120px]">
              <div className="space-y-1">
                {voiceChatUsers.map((user, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-zinc-400 hover:text-white group px-0"
                  >
                    <div className="flex items-center space-x-4 w-full">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{user[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center">{user}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <div className="flex-col mb-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-semibold text-zinc-400">USERS</h2>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 text-zinc-400 hover:text-white"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-zinc-400">
                {users.length} users online
              </p>
            </div>

            <ScrollArea className="h-[200px]">
              <div className="space-y-1">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 py-1 rounded hover:bg-white/5"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{user[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-zinc-200 truncate">{user}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <div className="mt-auto">
          <audio
            ref={remoteAudioRef}
            autoPlay
            controls
            className="w-full mb-2"
          />
          <div className="py-2 bg-light-zinc w-full flex items-center space-x-3 relative">
            <button className="flex flex-1 items-center space-x-2 p-1 pr-2 rounded-md hover:bg-hover-zinc-900/30">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>
              <p className="flex flex-col items-start space-y-1">
                <span className="block max-w-24 text-zinc-700 text-sm font-medium -mb-1.5 tracking-tight text-ellipsis overflow-x-clip">
                  {username}
                </span>
                <span className="text-xs text-zinc-500 inline-block">
                  {username ? "Online" : "Offline"} {/* WIP */}
                </span>
              </p>
            </button>
            <button
              className={`w-7 h-7 p-1 flex items-center justify-center relative rounded-full hover:bg-zinc-900/30 transition-all duration-100 ease-in-out ${
                !micActive ? "inactive-icon text-red-400" : "text-zinc-700"
              }`}
              onClick={toggleMic}
            >
              {micActive ? <Mic /> : <MicOff />}
            </button>
            {/* WIP
          <button
            className="w-7 h-7 p-1 flex items-center justify-center relative rounded-full hover:bg-zinc-900/30 transition-all duration-100 ease-in-out text-red-400"
          >
            <Speaker />
          </button>
          <button className="w-7 h-7 p-1 flex items-center justify-center relative rounded-md hover:bg-zinc-900/30 transition-all duration-100 ease-in-out text-zinc-700">
            <Gem className="w-full h-full" />
          </button>
          */}
          </div>
        </div>
      </div>
    </>
  );
}
