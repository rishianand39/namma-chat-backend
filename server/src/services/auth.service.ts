// src/services/AuthService.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotend from "dotenv";
dotend.config();

export class AuthService {
  private prisma = new PrismaClient();

  async register({ phone }: { phone: number }) {
    if (!phone) return new Error("Phone number is required");
    if (phone.toString().length !== 10) return new Error("Phone number must be 10 digits");
  
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (user) return new Error("User already exists");
  
    // Call sendOtp
    const otpResponse = await this.sendOtp({ phone });
  
    return {
      otpResponse
    };
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
    const shouldSend = Boolean(process.env.SEND_OTP_ON_PHONE);

    if (shouldSend) {
      // Integrate SMS sending service here ()
      
      return { message: "OTP sent to your phone" };
    } else {
      // Return OTP in response (useful for testing/dev)
      return { otp, expiresAt };
    }
  }

  async verifyOtp(phone: number, userOtp: number) {
    return true;
  }
}
