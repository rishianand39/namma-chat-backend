import { PrismaClient } from "@prisma/client";
import { Server, Socket } from "socket.io";

const prisma = new PrismaClient();

// In-memory store to track multiple sockets per user
const onlineUsers: Record<string, Set<string>> = {};

export function setupSocketServer(io: Server) {
  io.on("connection", async (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;

    if (!userId) {
      console.log("Socket connected without userId");
      socket.disconnect();
    return;
    }

    try {
      const validUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!validUser) {
        console.log("Invalid user ID:", userId);
        socket.disconnect();
        return;
      }

      if (!onlineUsers[userId]) {
        onlineUsers[userId] = new Set();
      }
      onlineUsers[userId].add(socket.id);

      if (onlineUsers[userId].size === 1) {
        await prisma.user.update({
          where: { id: userId },
          data: { is_online: true },
        });

        io.emit("user:online", { userId });
      }

      socket.on("disconnect", async () => {
        onlineUsers[userId]?.delete(socket.id);

        if (onlineUsers[userId]?.size === 0) {
          delete onlineUsers[userId];

          await prisma.user.update({
            where: { id: userId },
            data: {
              is_online: false,
              last_seen: new Date(),
            },
          });

          io.emit("user:offline", { userId, lastSeen: new Date() });
        }
      });
      console.log(onlineUsers, "total Online Users");
    } catch (error) {
      console.error("Error during socket connection validation:", error);
      socket.disconnect();
    }
  });
}
