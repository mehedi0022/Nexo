import crypto from "crypto";
import type { UserModel } from "../../generated/prisma/models/User.js";

export const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;
export const PASSWORD_RESET_EXPIRES_IN_MINUTES = 15;
export const EMAIL_VERIFICATION_EXPIRES_IN_MINUTES = 10;

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const createToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export const addMinutes = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

export const publicUser = (user: UserModel) => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};
