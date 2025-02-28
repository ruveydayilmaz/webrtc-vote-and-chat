"use client";

import React, { useEffect, useRef, useState } from "react";
import "webrtc-adapter";

import { ChatForm, ChatMessage, LoginForm, Sidebar, VoteForm, } from "@/components";
import { useToast } from "@/components/ui/toast";
import { useMessage, useSocket, useVoting, useWebRTC, } from "./hooks";

export default function Home() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  const scroll = useRef(null);
  const dataChannel = useRef<RTCDataChannel | null>(null);

  const { socket, isConnected, error } = useSocket();
  const { joinRoom, sendMessage, messages, users, voiceChatUsers, joined } =
    useMessage(room, username);
  const { inCall, startCall, leaveCall, remoteAudioRef, audioTrackRef } =
    useWebRTC(room, username, dataChannel);
  const { votes, castVote, resetVotes } = useVoting(room, dataChannel);
  const addToast = useToast();

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleError = (errorData: { message: string }) => {
      addToast(errorData.message, "error");
    };

    socket.on("error", handleError);

    return () => {
      socket.off("error", handleError);
    };
  }, [socket, isConnected]);

  useEffect(() => {
    error && error !== "" && addToast(error, "error");
  }, [error]);

  // Scroll to bottom
  useEffect(() => {
    // Fetching the chat div using the get element by id and then scrolling to the bottom
    var chatDiv = document.getElementById("chat-body");
    chatDiv?.scrollTo({ top: chatDiv.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="flex h-screen">
        <div className="flex-1">
          <div className="flex h-full">
            <main className="flex-1 flex flex-col">
              {!joined ? (
                <LoginForm
                  username={username}
                  room={room}
                  setUsername={setUsername}
                  setRoom={setRoom}
                  handleJoinRoom={joinRoom}
                />
              ) : (
                <div className="flex h-full relative">
                  <Sidebar
                    username={username}
                    users={users}
                    voiceChatUsers={voiceChatUsers}
                    startCall={startCall}
                    remoteAudioRef={remoteAudioRef}
                    audioTrackRef={audioTrackRef}
                    inCall={inCall}
                    leaveCall={leaveCall}
                  />

                  <div className="flex-1 flex flex-col p-4">
                    <div id="chat-body" className="flex-1 overflow-y-auto space-y-4 pt-20" ref={scroll}>
                      {messages.map((message, index) => (
                        <ChatMessage
                          key={index}
                          sender={message.sender}
                          message={message.message}
                          isOwnMessage={message.sender === username}
                        />
                      ))}
                    </div>

                    <ChatForm onSendMessage={sendMessage} />
                    <VoteForm
                      castVote={castVote}
                      votes={votes}
                      resetVotes={resetVotes}
                    />
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
