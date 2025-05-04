import { Server, Socket } from "socket.io";
import { MessageService } from "../../services/message.service";
import { MessagePayload, MessageResponse } from "../../types/socket.interface";

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

  // Handle message sending
  socket.on("send-message", async (data: MessagePayload) => {
    const receiverSocketId = onlineUsers.get(data.receiver_user_id);

    const response: MessageResponse = {
      message: data.message,
      sender_user_id: userId,
      timestamp: new Date().toISOString(),
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", response);
    } else {
      await messageService.saveMessage({
        sender_user_id: userId,
        receiver_user_id: data.receiver_user_id,
        content: data.message,
      });
    }
  });
}

