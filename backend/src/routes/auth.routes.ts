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

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/resend-verification-email", resendVerificationEmail);
router.get("/verify-email", verifyEmail);

router.use(requireAuth);

router.get("/me", getMe);
router.get("/profile", getProfile);
router.post("/logout", logout);
router.post("/change-password", changePassword);
router.post("/update-profile", updateProfile);
router.delete("/delete-account", deleteAccount);
router.post("/two-factor-auth", twoFactorAuth);

export default router;
