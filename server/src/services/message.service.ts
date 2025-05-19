import { Prisma, PrismaClient } from "@prisma/client";
import { RESPONSE_CODE } from "../constant";

export class MessageService {
  private prisma = new PrismaClient();

  async getUnreadMessages(user_id: string) {
    return await this.prisma.message.findMany({
      where: {
        receiver_user_id: user_id,
        is_read: false,
      },
      orderBy: {
        updated_at: "asc",
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

  async markMessageAsRead(payload: {
    message_id: string;
    read_at: Date;
  }) {
    return await this.prisma.message.update({
      where: {
        id: payload.message_id,
      },
      data: {
        is_read: true,
        read_at: payload.read_at,
      },
    });
  }

  async markMessageAsDelivered({
    message_id,
    delivered_at
  }: {
    message_id: string;
    delivered_at: Date;
  }) {
    return await this.prisma.message.update({
      where: { id: message_id },
      data: { delivered_at }
    });
  }

  async getChatList(user_id: string) {
    try {
      let history = await this.prisma.chatList.findMany({
        where: {
          user_id: user_id
        }
      })
      
      return {
        status: true,
        code: RESPONSE_CODE?.SUCCESS,
        data: history
      };
    } catch (error) {
      return {
        status: true,
        code: RESPONSE_CODE?.SERVER_ERROR,
        message: 'Contacts synced successfully'
      };
    }
  }

  async addOrUpdateChatList({
    user_id,
    contact_user_id,
    last_message,
    last_timestamp,
    unread_count,
    message_id
  } : {
    user_id: string;
    contact_user_id: string;
    last_message: string;
    last_timestamp: Date;
    unread_count: number;
    message_id: string;
  }) {
    try {
      let alreadyExists = await this.prisma.chatList.findFirst({
        where: {
          user_id: user_id,
          contact_user_id: contact_user_id
        }
      })
      if (alreadyExists) {
         await this.prisma.chatList.update({
          where: {
            id: alreadyExists.id
          },
          data: {
            last_message: last_message,
            last_timestamp: last_timestamp,
            unread_count: unread_count
          }
        })
        return {
          status: true,
          code: RESPONSE_CODE?.SUCCESS,
          data: 'Chat summary updated successfully',
        };
      }

      // If not exists, create a new chat
      await this.prisma.chatList.create({
        data: {
          user_id: user_id,
          contact_user_id: contact_user_id,
          last_message: last_message,
          last_timestamp: last_timestamp,
          unread_count: unread_count
        }
      })
      return {
        status: true,
        code: RESPONSE_CODE?.SUCCESS,
        data: 'New chat added successfully',
      };
    } catch (error: any) {
      return {
        status: false,
        code: RESPONSE_CODE?.SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
