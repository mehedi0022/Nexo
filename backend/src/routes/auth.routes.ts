import { Router } from "express";

import {
  changePassword,
  forgotPassword,
  getMe,
  getProfile,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  twoFactorAuth,
  updateProfile,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/authMiddleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  optionalRefreshTokenSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
} from "../validators/auth.validation.js";
import {
  forgotPasswordLimiter,
  loginLimiter,
  registerLimiter,
} from "../config/rateLimiter.js";

const router: Router = Router();

router.post(
  "/register",
  registerLimiter,
  validateRequest({ body: registerSchema }),
  register,
);
router.post(
  "/login",
  loginLimiter,
  validateRequest({ body: loginSchema }),
  login,
);
router.post(
  "/refresh-token",
  validateRequest({ body: refreshTokenSchema }),
  refreshToken,
);
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateRequest({ body: forgotPasswordSchema }),
  forgotPassword,
);
router.post(
  "/reset-password",
  validateRequest({ body: resetPasswordSchema }),
  resetPassword,
);

router.post(
  "/verify-email",
  validateRequest({ body: verifyEmailSchema }),
  verifyEmail,
);

router.use(requireAuth);

router.get("/me", getMe);
router.get("/profile", getProfile);
router.post(
  "/logout",
  validateRequest({ body: optionalRefreshTokenSchema }),
  logout,
);
router.post(
  "/change-password",
  validateRequest({ body: changePasswordSchema }),
  changePassword,
);
router.post(
  "/update-profile",
  validateRequest({ body: updateProfileSchema }),
  updateProfile,
);

export default router;
