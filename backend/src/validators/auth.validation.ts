import * as yup from "yup";

const email = yup.string().trim().lowercase().email().required();
const password = yup.string().trim().min(8).max(72).required();
const name = yup.string().trim().min(1).max(50).required();
const optionalName = yup.string().trim().min(1).max(50).optional();
const token = yup.string().trim().required();

export const registerSchema = yup.object({
  firstName: name,
  lastName: name,
  email,
  password,
  phone: yup.string().trim().max(15).optional(),
});

export const loginSchema = yup.object({
  email,
  password: yup.string().trim().required(),
});

export const refreshTokenSchema = yup.object({
  refreshToken: token,
});

export const optionalRefreshTokenSchema = yup.object({
  refreshToken: yup.string().trim().optional(),
});

export const forgotPasswordSchema = yup.object({
  email,
});

export const resetPasswordSchema = yup.object({
  token,
  password,
});

export const verifyEmailQuerySchema = yup.object({
  token,
});

export const verifyEmailBodySchema = yup.object({
  token,
});

export const resendVerificationEmailSchema = yup.object({
  email,
});

export const changePasswordSchema = yup.object({
  currentPassword: yup.string().trim().required(),
  newPassword: password,
});

export const updateProfileSchema = yup.object({
  firstName: optionalName,
  lastName: optionalName,
  phone: yup.string().trim().max(15).nullable().optional(),
  avatar: yup.string().trim().url().nullable().optional(),
});
