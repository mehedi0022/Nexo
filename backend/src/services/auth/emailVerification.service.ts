import { db } from "../../config/db.js";
import { AppError } from "../../utils/appError.js";
import {
  createEmailVerificationToken,
  hashToken,
  publicUser,
} from "./common.js";

export const verifyEmail = async (token: string) => {
  const storedToken = await db.emailVerificationToken.findUnique({
    where: { token: hashToken(token) },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  const user = await db.user.update({
    where: { id: storedToken.userId },
    data: { isVerified: true },
  });

  await db.emailVerificationToken.delete({ where: { id: storedToken.id } });

  return publicUser(user);
};

export const resendVerificationEmail = async (email: string) => {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("Email is already verified", 400);
  }

  await db.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });

  await createEmailVerificationToken(user);
};
