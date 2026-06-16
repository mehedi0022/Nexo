import { Redis, type Redis as RedisType } from "ioredis";
import { env } from "./env.js";

class RedisClient {
  private static instance: RedisType;

  static getInstance(): RedisType {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: env.redisHost,
        port: env.redisPort,

        retryStrategy(times) {
          if (times > 5) {
            console.error("❌ Redis max retries reached");
            return null;
          }
          return Math.min(times * 500, 3000);
        },

        maxRetriesPerRequest: 3,
        lazyConnect: true,
        enableOfflineQueue: false,
      });

      RedisClient.instance.on("connect", () => {
        console.log("✅ Redis connected");
      });

      RedisClient.instance.on("error", (error) => {
        console.error("❌ Redis error:", error.message);
      });

      RedisClient.instance.on("reconnecting", () => {
        console.log("🔄 Redis reconnecting...");
      });
    }

    return RedisClient.instance;
  }

  static async connect(): Promise<void> {
    try {
      await RedisClient.getInstance().connect();
    } catch (error) {
      console.error("❌ Redis connection failed:", error);
    }
  }

  static async disconnect(): Promise<void> {
    await RedisClient.getInstance().quit();
    console.log("Redis disconnected");
  }
}

export const redis = RedisClient.getInstance();
export const connectRedis = RedisClient.connect;
export const disconnectRedis = RedisClient.disconnect;
