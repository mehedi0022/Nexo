import { ApiResponse } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/auth/index.js";
import { env } from "../config/env.js";
import type { CookieOptions } from "express";

const cookieOptions = (maxAge: number): CookieOptions => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge,
  path: "/",
});

const clearCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  path: "/",
};

const ACCESS_TOKEN_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_AGE = (isRememberMe: boolean) =>
  isRememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

const setAuthCookies = (
  res: any,
  accessToken: string,
  refreshToken: string,
  isRememberMe: boolean = false,
) => {
  res.cookie("accessToken", accessToken, cookieOptions(ACCESS_TOKEN_AGE));
  res.cookie(
    "refreshToken",
    refreshToken,
    cookieOptions(REFRESH_TOKEN_AGE(isRememberMe)),
  );
};

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return ApiResponse.created(res, "User registered successfully", result);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken);

  return ApiResponse.ok(res, "Email verified successfully", {
    user: result.user,
    accessToken: result.accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { rememberMe } = req.body;
  const result = await authService.login(req.body);
  setAuthCookies(res, result.accessToken, result.refreshToken, rememberMe);
  return ApiResponse.ok(res, "User logged in successfully");
});

export const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refresh(
    req.body.refreshToken ?? req.cookies?.refreshToken,
  );
  res.cookie("accessToken", result.accessToken, cookieOptions(ACCESS_TOKEN_AGE));
  return ApiResponse.ok(res, "Token refreshed successfully", result);
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken ?? req.cookies?.refreshToken);
  res.clearCookie("accessToken", clearCookieOptions);
  res.clearCookie("refreshToken", clearCookieOptions);
  return ApiResponse.ok(res, "User logged out successfully");
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user?.id!);
  return ApiResponse.ok(
    res,
    "Current user profile retrieved successfully",
    user,
  );
});

export const getProfile = getMe;

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user?.id!, req.body);
  return ApiResponse.ok(res, "Profile updated successfully", user);
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(
    req.user?.id!,
    req.body.currentPassword,
    req.body.newPassword,
  );
  return ApiResponse.ok(res, "Password changed successfully");
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);
  return ApiResponse.ok(res, "Password reset email sent if the account exists");
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  return ApiResponse.ok(res, "Password reset successfully");
});

export const twoFactorAuth = asyncHandler(async () => {
  throw new AppError("Two-factor authentication is not configured yet", 501);
});
