import { db } from "../../config/db.js";
import { AppError } from "../../utils/appError.js";
import { comparePassword } from "../../utils/hashPassword.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import { hashToken } from "./common.js";

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const login = async (input: LoginInput) => {
  const user = await db.user.findUnique({ where: { email: input.email } });

  if (!user || !(await comparePassword(input.password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.isBanned) {
    throw new AppError("Your account has been banned", 403);
  }

  const accessToken = signAccessToken({
    userId: user.id,
    role: user.role,
  });
  const refreshToken = signRefreshToken(
    {
      userId: user.id,
      role: user.role,
    },
    input.rememberMe === true ? 604800 : 86400,
  );
  const refreshTokenTtl = input.rememberMe === true ? 604800 : 86400;

  await db.refreshToken.create({
    data: {
      userId: user.id,
      token: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + refreshTokenTtl * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const refresh = async (refreshToken: string) => {
  const storedToken = await db.refreshToken.findFirst({
    where: { token: hashToken(refreshToken) },
    include: { user: true },
  });

  if (
    !storedToken ||
    storedToken.revoked ||
    storedToken.expiresAt < new Date()
  ) {
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
  if (!refreshToken) return;

  await db.refreshToken.updateMany({
    where: { token: hashToken(refreshToken), revoked: false },
    data: { revoked: true },
  });
};
