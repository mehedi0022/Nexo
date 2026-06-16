import { db } from "../../config/db.js";
import { AppError } from "../../utils/appError.js";
import { publicUser } from "./common.js";

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  avatar?: string | null;
}

export const getProfile = async (userId: string) => {
  const user = await db.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return publicUser(user);
};

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput,
) => {
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
};

export const deleteAccount = async (userId: string) => {
  await db.user.delete({ where: { id: userId } });
};
