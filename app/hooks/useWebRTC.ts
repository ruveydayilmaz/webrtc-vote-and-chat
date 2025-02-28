import { useEffect, useRef, useState } from "react";

import { useSocket } from "./useSocket";
import { useVoting } from "./useVoting";

import { useToast } from "@/components/ui/toast";

export const useWebRTC = (room: string, username: string, dataChannel: React.RefObject<RTCDataChannel | null>) => {
  const { socket, emitEvent } = useSocket();
  const { setupDataChannel } = useVoting(room, dataChannel);
  const addToast = useToast();

  const [inCall, setInCall] = useState(false);

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const audioTrackRef = useRef<MediaStreamTrack | null>(null);

  useEffect(() => {
    // Handle incoming WebRTC offer
    socket.on("offer", async ({ offer }) => {
      peerConnection.current = createPeerConnection();
      // Set the remote description (received offer from another peer)
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      // Create an answer to the received offer
      const answer = await peerConnection.current.createAnswer();
      // Set the local description with the newly created answer
      await peerConnection.current.setLocalDescription(answer);
      emitEvent("answer", { room, answer });
    });

    // Handle answer response
    socket.on("answer", async ({ answer }) => {
      // Set the remote description (received answer from another peer)
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    // Handle ICE candidates
    socket.on("ice-candidate", async ({ candidate }) => {
      // Add an ICE candidate received from another peer to help establish connectivity
      await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [room]);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();
    // Event handler triggered when the local ICE candidate is gathered
    // If a candidate is found, send it to the other peer through the signaling server
    pc.onicecandidate = (event) => event.candidate && emitEvent("ice-candidate", { room, candidate: event.candidate });
    // Event handler triggered when a new media track (audio/video) is received
    // Set the received media stream as the source for the remote audio element
    pc.ontrack = (event) => remoteAudioRef.current && (remoteAudioRef.current.srcObject = event.streams[0]);

    // Create and configure the WebRTC data channel - will refactor this later
    dataChannel.current = pc.createDataChannel("votes");
    setupDataChannel(dataChannel.current);

    // Handle receiving a data channel from the remote peer
    pc.ondatachannel = (event) => {
      setupDataChannel(event.channel);
    };

    return pc;
  };

  // Start the voice call
  const startCall = async () => {
    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Audio track reference for toggling the mic
      audioTrackRef.current = localStreamRef.current.getAudioTracks()[0];

      peerConnection.current = createPeerConnection();
      localStreamRef.current.getTracks().forEach((track) =>
        peerConnection.current?.addTrack(track, localStreamRef.current!)
      );

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      emitEvent("offer", { room, offer });
      emitEvent("join-voice", { room, username });
      setInCall(true);
    } catch (error) {
      addToast("Microphone access denied or unavailable", "error");
    }
  };

  // Leave the voice call
  const leaveCall = () => {
    peerConnection.current?.close();
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    emitEvent("leave-call", { room });
    setInCall(false);
  };

  return { inCall, startCall, leaveCall, remoteAudioRef, audioTrackRef, dataChannel, };
};
