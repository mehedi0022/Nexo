import { db } from "../../config/db.js";
import { redis } from "../../config/redis.js";
import { AppError } from "../../utils/appError.js";
import { compareOTP } from "../../utils/hashOTP.js";
import { publicUser } from "./common.js";
import { hashToken } from "./common.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";

export interface VerifyEmailInput {
  email: string;
  otp: string;
}

export const verifyEmail = async (input: VerifyEmailInput) => {
  const email = input.email?.trim().toLowerCase();

  if (!email) {
    throw new AppError("Email is required to verify OTP", 400);
  }

  const otpKey = `otp:register:${email}`;
  const storedHash = await redis.get(otpKey);

  if (!storedHash) {
    throw new AppError("OTP expired or invalid. Please register again", 400);
  }
  const isValid = compareOTP(input.otp, storedHash);

  if (!isValid) {
    throw new AppError("Invalid OTP", 400);
  }

  const pendingKey = `pending:register:${email}`;
  const pendingData = await redis.get(pendingKey);

  if (!pendingData) {
    throw new AppError("Registration expired. Please register again", 400);
  }

  const userData = JSON.parse(pendingData);

  const user = await db.user.create({
    data: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      isVerified: true,
    },
  });

  await redis.del(otpKey);
  await redis.del(pendingKey);

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });

  const REFRESH_TOKEN_TTL = 86400;
  const refreshToken = signRefreshToken(
    { userId: user.id, role: user.role },
    REFRESH_TOKEN_TTL,
  );

  await db.refreshToken.create({
    data: {
      userId: user.id,
      token: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL * 1000),
    },
  });

  return {
    message: "Email verified successfully",
    user: publicUser(user),
    accessToken,
    refreshToken,
  };
};
