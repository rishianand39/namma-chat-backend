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
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const messageService = new message_service_1.MessageService();
function registerMessageHandlers(io, socket, userId, onlineUsers) {
    return __awaiter(this, void 0, void 0, function* () {
        // Send unread messages on connect
        const unreadMessages = yield messageService.getUnreadMessages(userId);
        if (unreadMessages.length > 0) {
            socket.emit("unread-messages", unreadMessages);
        }
        // Send current online users to the newly connected user
        socket.emit("online-users", Array.from(onlineUsers.keys()));
        // Broadcast to all others that this user is online
        let user_id = (0, auth_middleware_1.getUserFromSocket)(socket);
        socket.broadcast.emit("user-online", { user_id: user_id });
        // Handle message sending
        socket.on("send-message", (data) => __awaiter(this, void 0, void 0, function* () {
            const receiverSocketId = onlineUsers.get(data.receiver_user_id);
            // Save message in DB (so we have an ID to track delivery)
            const savedMessage = yield messageService.saveMessage({
                sender_user_id: userId,
                receiver_user_id: data.receiver_user_id,
                content: data.message,
            });
            const response = {
                message: data.message,
                sender_user_id: userId,
                timestamp: new Date().toISOString(),
                message_id: savedMessage.id,
            };
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", response);
                // Notify sender that message was delivered
                socket.emit("message-delivered", {
                    message_id: savedMessage.id,
                    delivered_at: new Date().toISOString(),
                });
                // Optionally update DB
                yield messageService.markMessageAsDelivered({
                    message_id: savedMessage.id,
                    delivered_at: new Date(),
                });
            }
        }));
        // Handle message reading
        socket.on("read-message", (data) => __awaiter(this, void 0, void 0, function* () {
            const senderSocketId = onlineUsers.get(data.sender_user_id); // Get the socket ID of the sender who sent the message
            if (senderSocketId) {
                io.to(senderSocketId).emit("read-success", {
                    message_id: data.message_id,
                    read_at: new Date().toISOString(),
                });
            }
            // Mark message as read in DB
            yield messageService.markMessageAsRead({
                message_id: data.message_id,
                read_at: new Date(),
            });
        }));
        // Handle typing indicator
        socket.on("typing", (data) => __awaiter(this, void 0, void 0, function* () {
            const receiverSocketId = onlineUsers.get(data.to_user_id); // Get the socket ID to whom event will be sent
            const from_user_id = (0, auth_middleware_1.getUserFromSocket)(socket);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("typing", {
                    from_user_id: from_user_id,
                });
            }
        }));
        // Handle stop typing indicator
        socket.on("stop-typing", (data) => __awaiter(this, void 0, void 0, function* () {
            const receiverSocketId = onlineUsers.get(data.to_user_id); // Get the socket ID to whom event will be sent
            const from_user_id = (0, auth_middleware_1.getUserFromSocket)(socket);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("stop-typing", {
                    from_user_id: from_user_id,
                });
            }
        }));
    });
}
