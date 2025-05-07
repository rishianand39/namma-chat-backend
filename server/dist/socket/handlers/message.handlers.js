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
exports.registerMessageHandlers = registerMessageHandlers;
const message_service_1 = require("../../services/message.service");
const messageService = new message_service_1.MessageService();
function registerMessageHandlers(io, socket, userId, onlineUsers) {
    return __awaiter(this, void 0, void 0, function* () {
        // Send unread messages on connect
        const unreadMessages = yield messageService.getUnreadMessages(userId);
        if (unreadMessages.length > 0) {
            socket.emit("unread-messages", unreadMessages);
        }
        // Handle message sending
        socket.on("send-message", (data) => __awaiter(this, void 0, void 0, function* () {
            const receiverSocketId = onlineUsers.get(data.receiver_user_id);
            const response = {
                message: data.message,
                sender_user_id: userId,
                timestamp: new Date().toISOString(),
            };
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", response);
            }
            else {
                yield messageService.saveMessage({
                    sender_user_id: userId,
                    receiver_user_id: data.receiver_user_id,
                    content: data.message,
                });
            }
        }));
    });
}
