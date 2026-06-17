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
    const client = RedisClient.getInstance();

    if (client.status === "ready") {
      return;
    }

    if (client.status !== "wait" && client.status !== "end") {
      await new Promise<void>((resolve, reject) => {
        const handleReady = () => {
          client.off("error", handleError);
          resolve();
        };

        const handleError = (error: Error) => {
          client.off("ready", handleReady);
          reject(error);
        };

        client.once("ready", handleReady);
        client.once("error", handleError);
      });
      return;
    }

    await client.connect();
  }

  static async disconnect(): Promise<void> {
    const client = RedisClient.getInstance();

    if (client.status === "end") {
      return;
    }

    await client.quit();
    console.log("Redis disconnected");
  }
}

export const redis = RedisClient.getInstance();
export const connectRedis = RedisClient.connect;
export const disconnectRedis = RedisClient.disconnect;
