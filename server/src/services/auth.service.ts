// src/services/AuthService.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotend from "dotenv";
dotend.config();

export class AuthService {
  private prisma = new PrismaClient();

  async register({ password, phone }: any) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { password: hashedPassword, phone },
    });
    return user;
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid password");

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return token;
  }
  async sendOtp({ phone }: { phone: number }) {
    const otpLength = Number(process.env.OTP_LENGTH) || 6; 
    const otp = Math.floor(
      Math.pow(10, otpLength - 1) + Math.random() * 9 * Math.pow(10, otpLength - 1)
    );
    const expiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY) * 60 * 1000); // OTP valid for specified minutes
    await this.prisma.otp.create({
      data : {
        phone,
        code : otp,
        expires_at : expiresAt,
      }
    });
    return otp;
  }

  async verifyOtp(phone: number, userOtp: number) {
    return true;
  }
}
