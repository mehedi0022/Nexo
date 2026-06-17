import { db } from "../../config/db.js";
import { env } from "../../config/env.js";
import { transporter } from "../../config/nodemailer.js";
import { AppError } from "../../utils/appError.js";
import { comparePassword, hashPassword } from "../../utils/hashPassword.js";
import {
  addMinutes,
  hashToken,
  PASSWORD_RESET_EXPIRES_IN_MINUTES,
} from "./common.js";

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user || !(await comparePassword(currentPassword, user.password))) {
    throw new AppError("Current password is incorrect", 401);
  }

  await db.user.update({
    where: { id: userId },
    data: { password: await hashPassword(newPassword) },
  });
};

export const forgotPassword = async (email: string) => {
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return;
  }

  const resetToken = createToken();

  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      token: hashToken(resetToken),
      expiresAt: addMinutes(PASSWORD_RESET_EXPIRES_IN_MINUTES),
    },
  });

  const resetUrl = `${env.clientOrigin}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"${env.smtpMailFromName}" <${env.smtpMailUser}>`,
    to: user.email,
    subject: "Reset your Nexo password",
    html: `<p>Hi ${user.firstName},</p><p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in ${PASSWORD_RESET_EXPIRES_IN_MINUTES} minutes.</p>`,
  });
};

export const resetPassword = async (token: string, password: string) => {
  const storedToken = await db.passwordResetToken.findUnique({
    where: { token: hashToken(token) },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  await db.$transaction([
    db.user.update({
      where: { id: storedToken.userId },
      data: { password: await hashPassword(password) },
    }),
    db.passwordResetToken.delete({ where: { id: storedToken.id } }),
    db.refreshToken.updateMany({
      where: { userId: storedToken.userId },
      data: { revoked: true },
    }),
  ]);
};
