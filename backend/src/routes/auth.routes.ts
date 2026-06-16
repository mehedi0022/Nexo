import { Router } from "express";

import {
  changePassword,
  deleteAccount,
  forgotPassword,
  getMe,
  getProfile,
  login,
  logout,
  refreshToken,
  register,
  resendVerificationEmail,
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
  resendVerificationEmailSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailQuerySchema,
} from "../validators/auth.validation.js";

const router: Router = Router();

router.post("/register", validateRequest({ body: registerSchema }), register);
router.post("/login", validateRequest({ body: loginSchema }), login);
router.post(
  "/refresh-token",
  validateRequest({ body: refreshTokenSchema }),
  refreshToken,
);
router.post(
  "/forgot-password",
  validateRequest({ body: forgotPasswordSchema }),
  forgotPassword,
);
router.post(
  "/reset-password",
  validateRequest({ body: resetPasswordSchema }),
  resetPassword,
);
router.post(
  "/resend-verification-email",
  validateRequest({ body: resendVerificationEmailSchema }),
  resendVerificationEmail,
);
router.get(
  "/verify-email",
  validateRequest({ query: verifyEmailQuerySchema }),
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
router.delete("/delete-account", deleteAccount);
router.post("/two-factor-auth", twoFactorAuth);

export default router;
