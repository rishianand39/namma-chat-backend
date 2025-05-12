// src/index.ts
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import messageRoutes from "./routes/message.routes";
import { setupSocketServer } from "./socket/setupSocketServer";
import { authenticateSocket } from "./middlewares/auth.middleware";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: ["*", "http://localhost:3000", "https://rishianand.me", "https://rishianand.me/"],
    // credentials: true,
  })
);

declare module "socket.io" {
  interface Socket {
    user?: any;
  }
}
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

io.use(authenticateSocket);

setupSocketServer(io);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
