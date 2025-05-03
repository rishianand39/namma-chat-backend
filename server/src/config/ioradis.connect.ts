import Redis from "ioredis";

export const redis =  new Redis({
    port : 14863,
    host : "redis-14863.c232.us-east-1-2.ec2.redns.redis-cloud.com",
    username: "default",
    password: "KTUSJrBMFOHjwRRDwbqk4punGy5Bytbd",
    db: 0,
  });