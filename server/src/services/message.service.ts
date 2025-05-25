import { Prisma, PrismaClient } from "@prisma/client";
import { RESPONSE_CODE } from "../constant";
import { UserService } from "./user.service";

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
      const chatHistory = await this.prisma.chatList.findMany({
        where: {
          OR: [
            { user_id: user_id },
            { contact_user_id: user_id },
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              profile_image: true,
              phone: true
            }
          },
          contact_user: {
            select: {
              id: true,
              name: true,
              profile_image: true,
              phone: true
            }
          },
          message: {
            select: {
              id: true,
              content: true,
              updated_at: true,
              is_sent: true,
              sent_at: true,
              is_delivered: true,
              delivered_at: true,
              is_read: true,
              read_at: true,
              is_deleted: true,
              is_edited: true,
            }
          }
        }
      });

    
      const formatted = chatHistory.map(chat => {
        const contact = chat.user_id === user_id ? chat.contact_user : chat.user;
        return {
          id: chat.id,
          contact_user: contact,
          message : chat.message,
        };
      });
      
      return {
        status: true,
        code: RESPONSE_CODE?.SUCCESS,
        data: formatted
      };
    } catch (error) {
      console.error(error);
      return {
        status: false,
        code: RESPONSE_CODE?.SERVER_ERROR,
        message: 'Failed to fetch chat list'
      };
    }
  }


  async addOrUpdateChatList({
    user_id,
    contact_user_id,
    message_id
  }: {
    user_id: string;
    contact_user_id: string;
    message_id: string;
  }) {
    try {
      await this.prisma.chatList.upsert({
        where: {
          user_id_contact_user_id: {
            user_id: user_id,
            contact_user_id: contact_user_id,
          },
        },
        update: {
          message_id: message_id,
        },
        create: {
          user_id: user_id,
          contact_user_id: contact_user_id,
          message_id: message_id,
        },
      });

      return {
        status: true,
        code: RESPONSE_CODE?.SUCCESS,
        data: 'chat summary updated successfully',
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
