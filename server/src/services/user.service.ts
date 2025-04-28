import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

export class UserService {
  private prisma = new PrismaClient();


  async getUser(user_id : string ) {
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
      is_online : user?.is_online,
      last_seen : user?.last_seen,
    };
  }

  async updateUser({ user_id, data }: { user_id: string; data: {
    name?: string;
    email?: string;
    profile_image?: string;
    about?: string;
  } }) {
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
      is_online : user.is_online,
      last_seen : user.last_seen,
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
  async importContacts(phone_numbers: string[]) {
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
  
    return allContacts;
  }
  
  
  

}
