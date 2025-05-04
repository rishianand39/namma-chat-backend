import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redis =  new Redis({
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    host: process.env.REDIS_HOST || "127.0.0.1",
    username: process.env.REDIS_USERNAME || "",
    password: process.env.REDIS_PASSWORD || "",
    db: parseInt(process.env.REDIS_DB || "0", 10)
  });