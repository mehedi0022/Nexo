import { db } from "../../config/db.js";
import { AppError } from "../../utils/appError.js";
import { hashPassword } from "../../utils/hashPassword.js";
import {
  createEmailVerificationToken,
  issueTokens,
  publicUser,
} from "./common.js";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export const register = async (input: RegisterInput) => {
  const existingUser = await db.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    throw new AppError("User with this email already exists", 409);
  }

  const user = await db.user.create({
    data: {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      password: await hashPassword(input.password),
    },
  });

  await createEmailVerificationToken(user);

  return {
    user: publicUser(user),
    ...(await issueTokens(user)),
  };
};
