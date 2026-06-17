import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

interface AccessTokenPayload {
  userId: string;
  role: string;
}

export const signAccessToken = (payload: AccessTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: "15m",
  };
  return jwt.sign(payload, env.accessTokenSecret, options);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.accessTokenSecret) as AccessTokenPayload;
};

export const signRefreshToken = (
  payload: AccessTokenPayload,
  expirySeconds: number,
): string => {
  const options: SignOptions = {
    expiresIn: expirySeconds, // 86400 (1d) or 604800 (7d)
  };
  return jwt.sign(payload, env.refreshTokenSecret, options);
};

export const verifyRefreshToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.refreshTokenSecret) as AccessTokenPayload;
};
