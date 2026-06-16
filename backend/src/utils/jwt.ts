import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { env } from "../config/env.js";

interface AccessTokenPayload {
  userId: string;
  role: string;
}

export const signAccessToken = (payload: AccessTokenPayload) => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as AccessTokenPayload;
};
