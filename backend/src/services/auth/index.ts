import { register } from "./register.service.js";
import { login, logout, refresh } from "./session.service.js";
import {
  changePassword,
  forgotPassword,
  resetPassword,
} from "./password.service.js";
import { deleteAccount, getProfile, updateProfile } from "./profile.service.js";
import { verifyEmail } from "./verifyEmail.service.js";

export const authService = {
  register,
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  deleteAccount,
};
