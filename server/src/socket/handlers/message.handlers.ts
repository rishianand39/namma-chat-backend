import { Server, Socket } from "socket.io";
import { MessageService } from "../../services/message.service";
import { MessagePayload, MessageResponse, ReadMessagePayload, TypingEventPayload } from "../../types/socket.interface";
import { getUserFromSocket } from "../../middlewares/auth.middleware";

const messageService = new MessageService();

export async function registerMessageHandlers(
  io: Server,
  socket: Socket,
  userId: string,
  onlineUsers: Map<string, string>
) {
  // Send unread messages on connect
  const unreadMessages = await messageService.getUnreadMessages(userId);
  if (unreadMessages.length > 0) {
    socket.emit("unread-messages", unreadMessages);
  }

  // Send current online users to the newly connected user
  socket.emit("online-users", Array.from(onlineUsers.keys()));

  // Broadcast to all others that this user is online
  let user_id = getUserFromSocket(socket);
  socket.broadcast.emit("user-online", { user_id: user_id });

  // Handle message sending
  socket.on("send-message", async (data: MessagePayload) => {
    const receiverSocketId = onlineUsers.get(data.receiver_user_id);

    // Save message in DB (so we have an ID to track delivery)
    const savedMessage = await messageService.saveMessage({
      sender_user_id: userId,
      receiver_user_id: data.receiver_user_id,
      content: data.message,
    });

    const response: MessageResponse = {
      message: data.message,
      sender_user_id: userId,
      timestamp: new Date().toISOString(),
      message_id: savedMessage.id,
    };
    // add chat summery to database


    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", response);

      // Notify sender that message was delivered
      socket.emit("message-delivered", {
        message_id: savedMessage.id,
        delivered_at: new Date().toISOString(),
      });

      // update DB
      await messageService.markMessageAsDelivered({
        message_id: savedMessage.id,
        delivered_at: new Date(),
      });
    }
    await messageService?.addOrUpdateChatList({
      user_id: userId,
      contact_user_id: data.receiver_user_id,
      last_message: data.message,
      message_id: savedMessage.id,
      last_timestamp : new Date(),
      unread_count : 1
    })
  });

  // Handle message reading
  socket.on("read-message", async (data: ReadMessagePayload) => {
    const senderSocketId = onlineUsers.get(data.sender_user_id); // Get the socket ID of the sender who sent the message

    if (senderSocketId) {
      io.to(senderSocketId).emit("read-success", {
        message_id: data.message_id,
        read_at: new Date().toISOString(),
      });
    }

    // Mark message as read in DB
    await messageService.markMessageAsRead({
      message_id: data.message_id,
      read_at: new Date(),
    });
  });

  // Handle typing indicator
  socket.on("typing", async (data: TypingEventPayload) => {
    const receiverSocketId = onlineUsers.get(data.to_user_id); // Get the socket ID to whom event will be sent
    const from_user_id = getUserFromSocket(socket);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", {
        from_user_id: from_user_id,
      });
    }
  });

  // Handle stop typing indicator
  socket.on("stop-typing", async (data: TypingEventPayload) => {
    const receiverSocketId = onlineUsers.get(data.to_user_id); // Get the socket ID to whom event will be sent
    const from_user_id = getUserFromSocket(socket);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop-typing", {
        from_user_id: from_user_id,
      });
    }
  });
}
