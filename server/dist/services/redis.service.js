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
exports.RedisService = void 0;
const ioradis_connect_1 = require("../config/ioradis.connect");
class RedisService {
    constructor() {
        this.redis = ioradis_connect_1.redis;
    }
    addUserSocket(userId, socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.sadd(`user:${userId}:sockets`, socketId);
        });
    }
    removeUserSocket(userId, socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.srem(`user:${userId}:sockets`, socketId);
        });
    }
    getSocketCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.redis.scard(`user:${userId}:sockets`);
        });
    }
    getAllOnlineUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // Optional - if you want to fetch online users separately
            // You would maintain a separate Redis SET called "online_users"
            return yield this.redis.smembers('online_users');
        });
    }
}
exports.RedisService = RedisService;
