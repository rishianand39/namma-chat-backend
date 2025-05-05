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
const auth_middleware_1 = require("../middlewares/auth.middleware");
const message_handlers_1 = require("./handlers/message.handlers");
const onlineUsers = new Map();
function setupSocketServer(io) {
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        const user = (0, auth_middleware_1.getUserFromSocket)(socket);
        onlineUsers.set(user.user_id, socket.id);
        console.log(`User connected: ${socket.id}, User ID: ${user.user_id}`);
        // Register message-related handlers
        yield (0, message_handlers_1.registerMessageHandlers)(io, socket, user.user_id, onlineUsers);
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
            onlineUsers.delete(user.user_id);
        });
    }));
}
