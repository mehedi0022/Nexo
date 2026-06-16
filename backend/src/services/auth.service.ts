import crypto from "crypto";

import { db } from "../config/db.js";
import { env } from "../config/env.js";
import type { UserModel } from "../generated/prisma/models/User.js";
import { AppError } from "../utils/appError.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { signAccessToken } from "../utils/jwt.js";
import { transporter } from "../config/nodemailer.js";
import { verifyEmailTemplate } from "../templates/emails/verifyEmail.js";

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;
const PASSWORD_RESET_EXPIRES_IN_MINUTES = 15;
const EMAIL_VERIFICATION_EXPIRES_IN_MINUTES = 10;

interface RegisterInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
}

interface LoginInput {
  email?: string;
  password?: string;
}

interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  avatar?: string | null;
}

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const createToken = () => {
  return crypto.randomBytes(48).toString("hex");
};

const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const addMinutes = (minutes: number) => {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};

const publicUser = (user: UserModel) => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

const issueTokens = async (user: UserModel) => {
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

const createEmailVerificationToken = async (user: UserModel) => {
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

export const authService = {
  async register(input: RegisterInput) {
    const { firstName, lastName, email, password, phone } = input;

    if (!firstName || !lastName || !email || !password) {
      throw new AppError("First name, last name, email, and password are required", 400);
    }

    const existingUser = await db.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: await hashPassword(password),
      },
    });

    await createEmailVerificationToken(user);

    const tokens = await issueTokens(user);

    return {
      user: publicUser(user),
      ...tokens,
    };
  },

  async login(input: LoginInput) {
    const { email, password } = input;

    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await db.user.findUnique({ where: { email } });

    if (!user || !(await comparePassword(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.isBanned) {
      throw new AppError("Your account has been banned", 403);
    }

    const tokens = await issueTokens(user);

    return {
      user: publicUser(user),
      ...tokens,
    };
  },

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

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
  },

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    await db.refreshToken.updateMany({
      where: { token: hashToken(refreshToken), revoked: false },
      data: { revoked: true },
    });
  },

  async getProfile(userId: string) {
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return publicUser(user);
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await db.user.update({
      where: { id: userId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        avatar: input.avatar,
      },
    });

    return publicUser(user);
  },

  async changePassword(userId: string, currentPassword?: string, newPassword?: string) {
    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user || !(await comparePassword(currentPassword, user.password))) {
      throw new AppError("Current password is incorrect", 401);
    }

    await db.user.update({
      where: { id: userId },
      data: { password: await hashPassword(newPassword) },
    });
  },

  async forgotPassword(email?: string) {
    if (!email) {
      throw new AppError("Email is required", 400);
    }

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
  },

  async resetPassword(token?: string, password?: string) {
    if (!token || !password) {
      throw new AppError("Reset token and new password are required", 400);
    }

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
  },

  async verifyEmail(token?: string) {
    if (!token) {
      throw new AppError("Verification token is required", 400);
    }

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
  },

  async resendVerificationEmail(email?: string) {
    if (!email) {
      throw new AppError("Email is required", 400);
    }

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
  },

  async deleteAccount(userId: string) {
    await db.user.delete({ where: { id: userId } });
  },
};
