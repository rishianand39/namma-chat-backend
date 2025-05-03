import Redis from "ioredis";
import { redis } from "../config/ioradis.connect";


export class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = redis;
  }
  
  async addUserSocket(userId: string, socketId: string) {
    await this.redis.sadd(`user:${userId}:sockets`, socketId);
  }

  async removeUserSocket(userId: string, socketId: string) {
    await this.redis.srem(`user:${userId}:sockets`, socketId);
  }

  async getSocketCount(userId: string): Promise<number> {
    return await this.redis.scard(`user:${userId}:sockets`);
  }

  async getAllOnlineUsers(): Promise<string[]> {
    // Optional - if you want to fetch online users separately
    // You would maintain a separate Redis SET called "online_users"
    return await this.redis.smembers('online_users');
  }
}
