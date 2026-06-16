import crypto from "crypto";

import { db } from "../../config/db.js";
import { env } from "../../config/env.js";
import { transporter } from "../../config/nodemailer.js";
import type { UserModel } from "../../generated/prisma/models/User.js";
import { verifyEmailTemplate } from "../../templates/emails/verifyEmail.js";
import { signAccessToken } from "../../utils/jwt.js";

export const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;
export const PASSWORD_RESET_EXPIRES_IN_MINUTES = 15;
export const EMAIL_VERIFICATION_EXPIRES_IN_MINUTES = 10;

export const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const createToken = () => {
  return crypto.randomBytes(48).toString("hex");
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

export const issueTokens = async (user: UserModel) => {
  const refreshToken = createToken();

  await db.refreshToken.create({
    data: {
      userId: user.id,
      token: hashToken(refreshToken),
      expiresAt: addDays(REFRESH_TOKEN_EXPIRES_IN_DAYS),
    },
  });

  return {
    accessToken: signAccessToken({ userId: user.id, role: user.role }),
    refreshToken,
  };
};

export const createEmailVerificationToken = async (user: UserModel) => {
  const verificationToken = createToken();

  await db.emailVerificationToken.create({
    data: {
      userId: user.id,
      token: hashToken(verificationToken),
      expiresAt: addMinutes(EMAIL_VERIFICATION_EXPIRES_IN_MINUTES),
    },
  });

  await transporter.sendMail({
    from: `"${env.smtpMailFromName}" <${env.smtpMailUser}>`,
    to: user.email,
    subject: "Verify your Nexo email",
    html: verifyEmailTemplate(verificationToken, user.firstName),
  });
};
