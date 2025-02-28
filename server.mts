import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

type Rooms = {
  [roomId: string]: {
    [socketId: string]: string;
  };
};

app.prepare().then(() => {
  const httpServer = createServer(handle);
  const io = new Server(httpServer);

  const rooms: Rooms = {};
  const voiceRooms: Rooms = {};
  io.on("connection", (socket) => {
    console.log("user connected: ", socket.id);

    socket.on("join-room", ({ room, username }) => {
      try {
        if (!room || !username) throw new Error("Invalid room or username");
        socket.join(room);

        rooms[room] = rooms[room] || {};
        rooms[room][socket.id] = username;
        console.log(`User ${username} joined room ${room}`);

        socket.to(room).emit("user_joined", `${username} joined room`);
        io.in(room).emit("user_list", Object.values(rooms[room]));
      } catch (error) {
        console.error("Error in join-room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on("message", ({ room, message, sender }) => {
      try {
        if (!room || !message || !sender)
          throw new Error("Invalid message data");
        console.log(`Message in room ${room}: ${message} from ${sender}`);
        socket.join(room);
        socket.to(room).emit("message", { sender, message });
      } catch (error) {
        console.error("Error in message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle WebRTC signaling
    socket.on("offer", ({ room, offer }) => {
      try {
        if (!room || !offer) throw new Error("Invalid offer data");
        socket.to(room).emit("offer", { offer });
      } catch (error) {
        console.error("Error in offer:", error);
        socket.emit("error", { message: "Failed to process offer" });
      }
    });

    socket.on("join-voice", ({ room, username }) => {
      try {
        if (!room || !username) throw new Error("Invalid voice room data");
        voiceRooms[room] = voiceRooms[room] || {};
        voiceRooms[room][socket.id] = username;
        io.in(room).emit("voice_chat_list", Object.values(voiceRooms[room]));
      } catch (error) {
        console.error("Error in join-voice:", error);
        socket.emit("error", { message: "Failed to join voice chat" });
      }
    });

    socket.on("answer", ({ room, answer }) => {
      try {
        if (!room || !answer) throw new Error("Invalid answer data");
        socket.to(room).emit("answer", { answer });
      } catch (error) {
        console.error("Error in answer:", error);
        socket.emit("error", { message: "Failed to process answer" });
      }
    });

    socket.on("leave-call", ({ room }) => {
      try {
        if (!room) throw new Error("Invalid room data");
        if (voiceRooms[room] && voiceRooms[room][socket.id]) {
          delete voiceRooms[room][socket.id];

          socket.to(room).emit("user_left_call", { socketId: socket.id });
          io.in(room).emit("voice_chat_list", Object.values(voiceRooms[room]));
        }
      } catch (error) {
        console.error("Error in leave-call:", error);
        socket.emit("error", { message: "Failed to leave call" });
      }
    });

    socket.on("ice-candidate", ({ room, candidate }) => {
      try {
        if (!room || !candidate) throw new Error("Invalid ICE candidate data");
        socket.to(room).emit("ice-candidate", { candidate });
      } catch (error) {
        console.error("Error in ice-candidate:", error);
        socket.emit("error", { message: "Failed to answer ice candidate" });
      }
    });

    socket.on("vote", ({ room, vote }) => {
      try {
        if (!room || !["yes", "no"].includes(vote)) throw new Error("Invalid vote data");
        socket.to(room).emit("vote", { vote });
      } catch (error) {
        console.error("Error in vote:", error);
        socket.emit("error", { message: "Failed to vote" });
      }
    });

    socket.on("reset-votes", ({ room }) => {
      try {
        if (!room) throw new Error("Invalid room data");
        socket.to(room).emit("reset-votes");
      } catch (error) {
        console.error("Error in reset-votes:", error);
        socket.emit("error", { message: "Failed to reset votes" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      try {
        for (const room in rooms) {
          if (rooms[room][socket.id]) {
            delete rooms[room][socket.id];
            io.in(room).emit("user_list", Object.values(rooms[room]));
          }
        }
        for (const room in voiceRooms) {
          if (voiceRooms[room][socket.id]) {
            delete voiceRooms[room][socket.id];
            io.in(room).emit(
              "voice_chat_list",
              Object.values(voiceRooms[room])
            );
          }
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
        socket.emit("error", { message: "Failed to disconnect" });
      }
    });
  });

  httpServer.listen(port, () => {
    console.log("Server running on: ", port);
  });

  httpServer.on("error", (error) => {
    console.error("Server error:", error);
  });
});
