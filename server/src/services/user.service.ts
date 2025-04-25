import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

export class UserService {
  private prisma = new PrismaClient();


  async getUser({ userId }: { userId: string }) {
    let user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    return {
      id: user?.id,
      name: user?.name,
      phone: user?.phone,
      email: user?.email,
      profile_image: user?.profile_image,
      about: user?.about,
    };
  }

  async updateUser({ userId, data }: { userId: string; data: {
    name?: string;
    email?: string;
    profile_image?: string;
    about?: string;
  } }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      profile_image: user.profile_image,
      about: user.about,
    };
  }
  
  async deleteUser({ userId }: { userId: string }) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return {
      message: "User deleted successfully",
      status: true,
      code: 200,
    };
  }


}
