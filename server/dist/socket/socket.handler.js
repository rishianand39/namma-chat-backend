"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketServer = setupSocketServer;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// In-memory store to track multiple sockets per user
const onlineUsers = {};
function setupSocketServer(io) {
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        const userId = socket.handshake.query.userId;
        if (!userId) {
            console.log("Socket connected without userId");
            socket.disconnect();
            return;
        }
        try {
            const validUser = yield prisma.user.findUnique({
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
                yield prisma.user.update({
                    where: { id: userId },
                    data: { is_online: true },
                });
                io.emit("user:online", { userId });
            }
            socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                (_a = onlineUsers[userId]) === null || _a === void 0 ? void 0 : _a.delete(socket.id);
                if (((_b = onlineUsers[userId]) === null || _b === void 0 ? void 0 : _b.size) === 0) {
                    delete onlineUsers[userId];
                    yield prisma.user.update({
                        where: { id: userId },
                        data: {
                            is_online: false,
                            last_seen: new Date(),
                        },
                    });
                    io.emit("user:offline", { userId, lastSeen: new Date() });
                }
            }));
            console.log(onlineUsers, "total Online Users");
        }
        catch (error) {
            console.error("Error during socket connection validation:", error);
            socket.disconnect();
        }
    }));
}
