import { useCallback, useEffect, useState } from "react";

import { socket } from "@/lib/socketClient";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on("connect_error", (err) => {
      setIsConnected(false);
      setError("Failed to connect to the server. Retrying...");
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      setError("Disconnected from server.");
    });

    socket.on("reconnect_attempt", (attempt) => {
      setError(`Reconnecting... (Attempt ${attempt})`);
    });

    socket.on("reconnect", () => {
      console.log("Reconnected successfully!");
      setIsConnected(true);
      setError(null);
    });

    socket.on("reconnect_failed", () => {
      setError("Could not reconnect to the server.");
    });

    // Handle backend errors
    socket.on("error", (errorData) => {
      setError(errorData.message || "An unknown server error occurred.");
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("reconnect_attempt");
      socket.off("reconnect");
      socket.off("reconnect_failed");
      socket.off("error");
      socket.close();
    };
  }, []);

  // Function to emit socket events with error handling
  const emitEvent = useCallback((event: string, data: any) => {
    if (socket) {
      try {
        socket.emit(event, data);
      } catch (err) {
        setError(`Failed to send ${event}`);
      }
    } else {
      console.warn(`Cannot emit ${event}, socket not connected.`);
      setError("Not connected to the server.");
    }
  }, [socket]);

  return { socket, isConnected, error, emitEvent };
};
