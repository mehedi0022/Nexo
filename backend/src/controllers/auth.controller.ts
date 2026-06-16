import { ApiResponse } from "../utils/apiResponse.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/auth.service.js";

const getAuthenticatedUserId = (userId?: string) => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  return userId;
};

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return ApiResponse.created(res, "User registered successfully", result);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return ApiResponse.ok(res, "User logged in successfully", result);
});

export const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  return ApiResponse.ok(res, "Token refreshed successfully", result);
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  return ApiResponse.ok(res, "User logged out successfully");
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(getAuthenticatedUserId(req.user?.id));
  return ApiResponse.ok(res, "Current user profile retrieved successfully", user);
});

export const getProfile = getMe;

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(
    getAuthenticatedUserId(req.user?.id),
    req.body,
  );
  return ApiResponse.ok(res, "Profile updated successfully", user);
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(
    getAuthenticatedUserId(req.user?.id),
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

export const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.body.token ?? req.query.token;
  const user = await authService.verifyEmail(
    typeof token === "string" ? token : undefined,
  );
  return ApiResponse.ok(res, "Email verified successfully", user);
});

export const resendVerificationEmail = asyncHandler(async (req, res) => {
  await authService.resendVerificationEmail(req.body.email);
  return ApiResponse.ok(res, "Verification email resent");
});

export const deleteAccount = asyncHandler(async (req, res) => {
  await authService.deleteAccount(getAuthenticatedUserId(req.user?.id));
  return ApiResponse.ok(res, "Account deleted successfully");
});

export const twoFactorAuth = asyncHandler(async () => {
  throw new AppError("Two-factor authentication is not configured yet", 501);
});
