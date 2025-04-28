// src/index.ts
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import authRoutes from "./routes/auth.routes"
import userRoutes from "./routes/user.routes"
import { setupSocketServer } from './socket/socket.handler';
// (chatRoutes, messageRoutes coming soon)

dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});


setupSocketServer(io);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes)


const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
