import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "./redis.js";

const createLimiter = (windowMs: number, max: number, message: string) =>
  rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: async (...args: [string, ...string[]]) => {
        const [command, ...rest] = args;
        return redis.call(command, ...rest) as unknown as Promise<number>;
      },
    }),
  });

export const globalLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  "Too many requests, please try again later",
);

export const loginLimiter = createLimiter(
  15 * 60 * 1000,
  5,
  "Too many login attempts, please try again after 15 minutes",
);

export const registerLimiter = createLimiter(
  60 * 60 * 1000,
  50,
  "Too many accounts created, please try again after an hour",
);

export const forgotPasswordLimiter = createLimiter(
  60 * 60 * 1000,
  3,
  "Too many password reset attempts, please try again after an hour",
);

export const otpLimiter = createLimiter(
  10 * 60 * 1000,
  5,
  "Too many OTP attempts, please request a new OTP",
);

export const paymentLimiter = createLimiter(
  60 * 1000,
  10,
  "Too many payment requests, please slow down",
);

export const searchLimiter = createLimiter(
  60 * 1000,
  30,
  "Too many search requests, please slow down",
);
