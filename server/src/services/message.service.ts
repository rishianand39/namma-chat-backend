import { PrismaClient } from "@prisma/client";

export class MessageService {
  private prisma = new PrismaClient();

  async getUnreadMessages(user_id: string) {
    return await this.prisma.message.findMany({
      where: {
        receiver_user_id: user_id,
        read: false,
      },
      orderBy: {
        timestamp: "asc",
      },
    });
  }

  async saveMessage(payload: {
    sender_user_id: string;
    receiver_user_id: string;
    content: string;
  }) {
    return await this.prisma.message.create({
      data: {
        sender_user_id: payload.sender_user_id,
        receiver_user_id: payload.receiver_user_id,
        content: payload.content,
      },
    });
  }
}
