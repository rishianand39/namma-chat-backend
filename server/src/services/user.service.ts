import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { RESPONSE_CODE } from "../constant";
dotenv.config();

export class UserService {
  private prisma = new PrismaClient();


  async getUser(user_id: string) {
    let user = await this.prisma.user.findFirst({
      where: { id: user_id },
    });

    return {
      id: user?.id,
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
      profile_image: user?.profile_image,
      about: user?.about,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
      is_online: user?.is_online,
      last_seen: user?.last_seen,
    };
  }

  async updateUser({ user_id, data }: {
    user_id: string; data: {
      name?: string;
      email?: string;
      profile_image?: string;
      about?: string;
    }
  }) {
    const user = await this.prisma.user.update({
      where: { id: user_id },
      data,
    });
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      profile_image: user.profile_image,
      about: user.about,
      created_at: user.created_at,
      updated_at: user.updated_at,
      is_online: user.is_online,
      last_seen: user.last_seen,
    };
  }

  async deleteUser({ user_id }: { user_id: string }) {
    await this.prisma.user.delete({
      where: { id: user_id },
    });
    return {
      message: "User deleted successfully",
    }
  }

  async importContacts(user_id: string, phone_numbers: string[]) {
    const registeredUsers = await this.prisma.user.findMany({
      where: {
        phone: {
          in: phone_numbers,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        profile_image: true,
        created_at: true,
        updated_at: true,
        is_online: true,
        last_seen: true,

      },
    });

    const registeredPhones = registeredUsers.map(u => u.phone);

    const baseUrl = process.env.APP_INVITE_URL

    const registeredContacts = registeredUsers.map(user => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      profile_image: user.profile_image,
      is_registered: true,
      created_at: user.created_at,
      updated_at: user?.updated_at,

    }));

    const unregisteredContacts = phone_numbers
      .filter(phone => !registeredPhones.includes(phone))
      .map(phone => ({
        id: null,
        name: null,
        phone: phone,
        profile_image: null,
        is_registered: false,
        invite_link: `${baseUrl}?phone=${phone}`,
      }));

    const allContacts = [...registeredContacts, ...unregisteredContacts];
    await this.prisma.contactList.create({
      data: {
        owner_id: user_id,
        contacts: allContacts
      }
    })
    return allContacts;
  }

  async getContacts(user_id: string) {
    const contactList = await this.prisma.contactList.findFirst({
      where: {
        owner_id: user_id
      },
      select: {
        id: true,
        contacts: true,
        updated_at: true
      },
    });
    if (!contactList) return [];

    const { updated_at, ...rest } = contactList;

    return {
      ...rest,
      last_synced_at: updated_at
    };
  }
  
  async syncContacts(user_id: string, newContacts: string[]) {
        const registeredUsers = await this.prisma.user.findMany({
      where: {
        phone: {
          in: newContacts,
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        profile_image: true,
        created_at: true,
        updated_at: true,
        is_online: true,
        last_seen: true,

      },
    });

    const registeredPhones = registeredUsers.map(u => u.phone);

    const baseUrl = process.env.APP_INVITE_URL

    const registeredContacts = registeredUsers.map(user => ({
      id: user.id,
      name: user.name,
      phone: user.phone,
      profile_image: user.profile_image,
      is_registered: true,
      created_at: user.created_at,
      updated_at: user?.updated_at,

    }));

    const unregisteredContacts = newContacts
      .filter(phone => !registeredPhones.includes(phone))
      .map(phone => ({
        id: null,
        name: null,
        phone: phone,
        profile_image: null,
        is_registered: false,
        invite_link: `${baseUrl}?phone=${phone}`,
      }));

    const allContacts = [...registeredContacts, ...unregisteredContacts];
    try {
      await this.prisma.contactList.update({
        where: {
          owner_id: user_id
        },
        data: {
          contacts: allContacts
        }
      });

      return {
        status: true,
        code: RESPONSE_CODE?.SUCCESS,
        message: 'Contacts synced successfully'
      };
    } catch (error: any) {
      return {
        status: false,
        code: RESPONSE_CODE?.SERVER_ERROR,
        message: error.message,
      }
    }
  }
}
