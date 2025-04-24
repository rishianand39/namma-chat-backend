import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotend from "dotenv";
import twilio from "twilio";
dotend.config();

export class AuthService {
  private prisma = new PrismaClient();

  async sendOtp({ phone }: { phone: string }) {
    const otpLength = Number(process.env.OTP_LENGTH) || 6;
    const otp = Math.floor(Math.pow(10, otpLength - 1) + Math.random() * 9 * Math.pow(10, otpLength - 1));
    const expiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY) * 60 * 1000); // OTP valid for specified minutes

    if (phone) {
      await this.prisma.otp.deleteMany({
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
        code: 200,
        message: "OTP sent successfully",
      };
    } else {
      console.log(otp, "otp");
      return {
        data: {
          otp: otp,
        },
        message: "OTP generated successfully",
        status: true,
        code: 200,
      };
    }
  }

  async geneateToken(userId: string) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRY ? parseInt(process.env.JWT_EXPIRY, 10) : "7d",
    });
    return token;
  }

  async verifyOtp({ phone, otp }: { phone: string; otp: string }) {
    try {
      if (!phone || !otp) {
        return {
          message: "Phone number and OTP are required",
          status: false,
          code: 500,
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
          code: 500,
        };
      }

      await this.prisma.otp.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });

      let user = await this.prisma.user.findUnique({ where: { phone: phone } });

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
        },
        message: "OTP verified successfully",
        status: true,
        code: 200,
      };
    } catch (error: any) {
      return {
        message: error.message,
        status: false,
        code: 500,
      };
    }
  }
}
