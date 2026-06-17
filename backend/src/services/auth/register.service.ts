import { db } from "../../config/db.js";
import { redis } from "../../config/redis.js";
import { AppError } from "../../utils/appError.js";
import { generateOTP, hashOTP } from "../../utils/hashOTP.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { sendVerificationEmail } from "../../utils/sendEmail.js";

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export const register = async (input: RegisterInput) => {
  const existingUser = await db.user.findFirst({
    where: {
      OR: [
        { email: input.email },
        ...(input.phone ? [{ phone: input.phone }] : []),
      ],
    },
  });

  if (existingUser) {
    throw new AppError("User with this email or phone already exists", 409);
  }

  const pendingKey = `pending:register:${input.email}`;
  const existing = await redis.get(pendingKey);

  if (existing) {
    throw new AppError(
      "Verification email already sent. Please check your inbox or wait 10 minutes",
      429,
    );
  }
  const hashedPassword = await hashPassword(input.password);

  const tempUserData = JSON.stringify({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone || null,
    password: hashedPassword,
  });

  await redis.setex(pendingKey, 600, tempUserData);

  const otp = generateOTP();
  const hashedOtp = hashOTP(otp);

  const otpKey = `otp:register:${input.email}`;
  await redis.setex(otpKey, 600, hashedOtp);

  await sendVerificationEmail(input.email, input.firstName, otp);

  return {
    success: true,
    message: "Verification email sent. Please check your inbox",
    email: input.email,
  };
};
