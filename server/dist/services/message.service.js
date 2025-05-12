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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const client_1 = require("@prisma/client");
class MessageService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getUnreadMessages(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.message.findMany({
                where: {
                    receiver_user_id: user_id,
                    read: false,
                },
                orderBy: {
                    timestamp: "asc",
                },
            });
        });
    }
    saveMessage(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.message.create({
                data: {
                    sender_user_id: payload.sender_user_id,
                    receiver_user_id: payload.receiver_user_id,
                    content: payload.content,
                },
            });
        });
    }
    markMessageAsRead(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.prisma.message.update({
                where: {
                    id: payload.message_id,
                },
                data: {
                    read: true,
                    read_at: payload.read_at,
                },
            });
        });
    }
    markMessageAsDelivered(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message_id, delivered_at }) {
            return yield this.prisma.message.update({
                where: { id: message_id },
                data: { delivered_at }
            });
        });
    }
}
exports.MessageService = MessageService;
