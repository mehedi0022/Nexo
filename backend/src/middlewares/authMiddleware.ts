import type { RequestHandler } from "express";

import { db } from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const requireAuth: RequestHandler = asyncHandler(
  async (req, _res, next) => {
    const token =
      req.cookies?.accessToken ??
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined);

    if (!token) {
      throw new AppError("Authentication token is required", 401);
    }

    const payload = verifyAccessToken(token);
    const user = await db.user.findUnique({ where: { id: payload.userId } });

    if (!user || user.isBanned) {
      throw new AppError("Invalid authentication token", 401);
    }

    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  },
);
