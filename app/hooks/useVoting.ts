import { useEffect, useState } from "react";

import { useSocket } from "./useSocket";
import { useToast } from "@/components/ui/toast";

export const useVoting = (room: string, dataChannel: React.RefObject<RTCDataChannel | null>) => {
  const { socket, emitEvent } = useSocket();
  const addToast = useToast();

  const [votes, setVotes] = useState({ yes: 0, no: 0 });

  useEffect(() => {
    // Listen for vote updates
    socket.on("vote", ({ vote }: { vote: "yes" | "no" }) =>
      setVotes((prev) => ({ ...prev, [vote]: prev[vote] + 1 }))
    );

    socket.on("reset-votes", () => setVotes({ yes: 0, no: 0 }));

    return () => {
      socket.off("vote");
      socket.off("reset-votes");
    };
  }, []);

  // Function to cast a vote
  const castVote = (vote: "yes" | "no") => {
    setVotes((prev) => ({ ...prev, [vote]: prev[vote] + 1 }));

    if (dataChannel.current && dataChannel.current.readyState === "open") {
      dataChannel.current.send(JSON.stringify(vote));
    } else {
      // Fallback to socket.io if WebRTC Data Channel is not ready
      emitEvent("vote", { room, vote });
    }
  };

  // Listen for vote resets
  const resetVotes = () => {
    const resetVoteData = { yes: 0, no: 0 };
    setVotes(resetVoteData);

    // Send vote reset via WebRTC Data Channel (if available)
    if (dataChannel.current && dataChannel.current.readyState === "open") {
      dataChannel.current.send(
        JSON.stringify({ type: "reset-votes", data: resetVoteData })
      );
    } else {
      // Fallback to socket.io if WebRTC Data Channel is not ready
      emitEvent("reset-votes", { room });
    }

    emitEvent("reset-votes", { room });
  };

  // Helper function to set up WebRTC Data Channel
  const setupDataChannel = (channel: RTCDataChannel) => {
    channel.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "vote") {
          const voteType = data as "yes" | "no";
          setVotes((prev) => ({ ...prev, [voteType]: prev[voteType] + 1 }));
        } else if (type === "reset-votes") {
          setVotes({ yes: 0, no: 0 });
        }
      } catch (error) {
        addToast("Error parsing data channel message", "error");
      }
    };
  };

  return { votes, castVote, resetVotes, setupDataChannel };
};
