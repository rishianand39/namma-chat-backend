import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import twilio from "twilio";
import { RESPONSE_CODE } from "../constant";
import { stat } from "fs";
dotenv.config();

export class AuthService {
  private prisma = new PrismaClient();

  async sendOtp({ phone }: { phone: string }) {
    const otpLength = Number(process.env.OTP_LENGTH) || 6;
    const otp = Math.floor(Math.pow(10, otpLength - 1) + Math.random() * 9 * Math.pow(10, otpLength - 1));
    const expiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY) * 60 * 1000); // OTP valid for specified minutes

    if (phone) {
      await this?.prisma?.otp?.deleteMany({
        where: {
          phone,
        },
      });
    }

    await this.prisma.otp.create({
      data: {
        phone,
        code: otp?.toString(),
        expires_at: expiresAt,
      },
    });

    const shouldSend = process.env.SEND_OTP_ON_PHONE === "true";
    if (shouldSend) {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = twilio(accountSid, authToken);
      const message = `Your OTP is ${otp}. It is valid for ${process.env.OTP_EXPIRY} minutes. Please do not share it with anyone.`;

      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phone}`,
      });

      return {
        status: true,
        code: RESPONSE_CODE?.SUCCESS,
        message: "OTP sent successfully",
      };
    } else {
      return {
        data: {
          otp: otp,
        },
        message: "OTP generated successfully",
        status: true,
        code: RESPONSE_CODE?.SUCCESS,
      };
    }
  }

  async geneateToken(user_id: string) {
    const secret = process.env.JWT_SECRET!;
    const expiresIn = (process.env.JWT_EXPIRY || "7d") as jwt.SignOptions["expiresIn"];

    const token = jwt.sign({ user_id }, secret, { expiresIn });
    return token;
  }

  async verifyOtp({ phone, otp }: { phone: string; otp: string }) {
    try {
      if (!phone || !otp) {
        return {
          message: "Phone number and OTP are required",
          status: false,
          code: RESPONSE_CODE?.SERVER_ERROR,
        };
      }
      const otpRecord = await this.prisma.otp.findFirst({
        where: {
          phone,
          code: otp,
          expires_at: { gt: new Date() },
          verified: false,
        },
        orderBy: { created_at: "desc" },
      });

      if (!otpRecord) {
        return {
          message: "Invalid or expired OTP",
          status: false,
          code: RESPONSE_CODE?.NOT_FOUND,
        };
      }

      await this.prisma.otp.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });

      let user = await this.prisma.user.findUnique({ where: { phone: phone } });
      let new_user = user ? false : true;
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            phone,
            name: "Guest",
          },
        });
        await this.prisma.otp.deleteMany({
          where: {
            phone,
            verified: false,
            expires_at: { lt: new Date() },
          },
        });
      }

      const geneateToken = await this.geneateToken(user.id);
      
      return {
        data: {
          token: geneateToken,
          new_user : new_user
        },
        message: "OTP verified successfully",
        status: true,
        code: RESPONSE_CODE?.SUCCESS,
      };
    } catch (error: any) {
      return {
        message: error.message,
        status: false,
        code: RESPONSE_CODE?.SERVER_ERROR,
      };
    }
  }

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

  async updateUser({
    userId,
    data,
  }: {
    userId: string;
    data: {
      name?: string;
      email?: string;
      profile_image?: string;
      about?: string;
    };
  }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data,
    });
    return {
      status: true,
      code: RESPONSE_CODE?.SUCCESS,
      data: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        profile_image: user.profile_image,
        about: user.about,
      },
    };
  }

  async deleteUser({ userId }: { userId: string }) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return {
      message: "User deleted successfully",
      status: true,
      code: RESPONSE_CODE?.SUCCESS,
    };
  }
}
