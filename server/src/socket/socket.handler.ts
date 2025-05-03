import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";

const prisma = new PrismaClient();

export function setupSocketServer(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}, User data: `, socket.user);

    socket.on("send-message", (data) => {
      console.log("Message received:", data);
      socket.to(data.receiverId).emit("receive-message", data);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
}
