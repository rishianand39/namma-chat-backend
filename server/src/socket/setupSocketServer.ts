import { Server } from "socket.io"
import { getUserFromSocket } from "../middlewares/auth.middleware";
import { registerMessageHandlers } from "./handlers/message.handlers";

const onlineUsers = new Map<string, string>();

export function setupSocketServer(io: Server) {
  io.on("connection", async (socket) => {
    const user = getUserFromSocket(socket);
    onlineUsers.set(user.user_id, socket.id);

    console.log(`User connected: ${socket.id}, User ID: ${user.user_id}`);

    // Register message-related handlers
    await registerMessageHandlers(io, socket, user.user_id, onlineUsers);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
      onlineUsers.delete(user.user_id);
    });
  });
}

