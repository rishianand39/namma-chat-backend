"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const twilio_1 = __importDefault(require("twilio"));
const constant_1 = require("../constant");
dotenv_1.default.config();
class AuthService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    sendOtp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ phone }) {
            const otpLength = Number(process.env.OTP_LENGTH) || 6;
            const otp = Math.floor(Math.pow(10, otpLength - 1) + Math.random() * 9 * Math.pow(10, otpLength - 1));
            const expiresAt = new Date(Date.now() + Number(process.env.OTP_EXPIRY) * 60 * 1000); // OTP valid for specified minutes
            if (phone) {
                yield this.prisma.otp.deleteMany({
                    where: {
                        phone,
                    },
                });
            }
            yield this.prisma.otp.create({
                data: {
                    phone,
                    code: otp === null || otp === void 0 ? void 0 : otp.toString(),
                    expires_at: expiresAt,
                },
            });
            const shouldSend = process.env.SEND_OTP_ON_PHONE === "true";
            if (shouldSend) {
                const accountSid = process.env.TWILIO_ACCOUNT_SID;
                const authToken = process.env.TWILIO_AUTH_TOKEN;
                const client = (0, twilio_1.default)(accountSid, authToken);
                const message = `Your OTP is ${otp}. It is valid for ${process.env.OTP_EXPIRY} minutes. Please do not share it with anyone.`;
                yield client.messages.create({
                    body: message,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `+91${phone}`,
                });
                return {
                    status: true,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                    message: "OTP sent successfully",
                };
            }
            else {
                return {
                    data: {
                        otp: otp,
                    },
                    message: "OTP generated successfully",
                    status: true,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                };
            }
        });
    }
    geneateToken(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const secret = process.env.JWT_SECRET;
            const expiresIn = (process.env.JWT_EXPIRY || "7d");
            const token = jsonwebtoken_1.default.sign({ user_id }, secret, { expiresIn });
            return token;
        });
    }
    verifyOtp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ phone, otp }) {
            try {
                if (!phone || !otp) {
                    return {
                        message: "Phone number and OTP are required",
                        status: false,
                        code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SERVER_ERROR,
                    };
                }
                const otpRecord = yield this.prisma.otp.findFirst({
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
                        code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.NOT_FOUND,
                    };
                }
                yield this.prisma.otp.update({
                    where: { id: otpRecord.id },
                    data: { verified: true },
                });
                let user = yield this.prisma.user.findUnique({ where: { phone: phone } });
                if (!user) {
                    user = yield this.prisma.user.create({
                        data: {
                            phone,
                            name: "Guest",
                        },
                    });
                    yield this.prisma.otp.deleteMany({
                        where: {
                            phone,
                            verified: false,
                            expires_at: { lt: new Date() },
                        },
                    });
                }
                const geneateToken = yield this.geneateToken(user.id);
                return {
                    data: {
                        token: geneateToken,
                    },
                    message: "OTP verified successfully",
                    status: true,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                };
            }
            catch (error) {
                return {
                    message: error.message,
                    status: false,
                    code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SERVER_ERROR,
                };
            }
        });
    }
    getUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            let user = yield this.prisma.user.findFirst({
                where: { id: userId },
            });
            return {
                id: user === null || user === void 0 ? void 0 : user.id,
                name: user === null || user === void 0 ? void 0 : user.name,
                phone: user === null || user === void 0 ? void 0 : user.phone,
                email: user === null || user === void 0 ? void 0 : user.email,
                profile_image: user === null || user === void 0 ? void 0 : user.profile_image,
                about: user === null || user === void 0 ? void 0 : user.about,
            };
        });
    }
    updateUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, data, }) {
            const user = yield this.prisma.user.update({
                where: { id: userId },
                data,
            });
            return {
                status: true,
                code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
                data: {
                    id: user.id,
                    name: user.name,
                    phone: user.phone,
                    email: user.email,
                    profile_image: user.profile_image,
                    about: user.about,
                },
            };
        });
    }
    deleteUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            yield this.prisma.user.delete({
                where: { id: userId },
            });
            return {
                message: "User deleted successfully",
                status: true,
                code: constant_1.RESPONSE_CODE === null || constant_1.RESPONSE_CODE === void 0 ? void 0 : constant_1.RESPONSE_CODE.SUCCESS,
            };
        });
    }
}
exports.AuthService = AuthService;
