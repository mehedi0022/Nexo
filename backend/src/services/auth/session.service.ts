import { db } from "../../config/db.js";
import { AppError } from "../../utils/appError.js";
import { comparePassword } from "../../utils/hashPassword.js";
import { signAccessToken } from "../../utils/jwt.js";
import { hashToken, issueTokens, publicUser } from "./common.js";

export interface LoginInput {
  email: string;
  password: string;
}

export const login = async (input: LoginInput) => {
  const user = await db.user.findUnique({ where: { email: input.email } });

  if (!user || !(await comparePassword(input.password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.isBanned) {
    throw new AppError("Your account has been banned", 403);
  }

  return {
    user: publicUser(user),
    ...(await issueTokens(user)),
  };
};

export const refresh = async (refreshToken: string) => {
  const storedToken = await db.refreshToken.findUnique({
    where: { token: hashToken(refreshToken) },
    include: { user: true },
  });

  if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  if (storedToken.user.isBanned) {
    throw new AppError("Your account has been banned", 403);
  }

  return {
    accessToken: signAccessToken({
      userId: storedToken.user.id,
      role: storedToken.user.role,
    }),
  };
};

export const logout = async (refreshToken?: string) => {
  if (!refreshToken) {
    return;
  }

  await db.refreshToken.updateMany({
    where: { token: hashToken(refreshToken), revoked: false },
    data: { revoked: true },
  });
};
