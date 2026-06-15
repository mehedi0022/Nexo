import cors from "cors";
import type { Express } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { env } from "../config/env";
import { errorHandler, notFoundHandler } from "./errorHandler";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const registerMiddlewares = (app: Express) => {
  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(apiLimiter);
};

export const registerErrorHandlers = (app: Express) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};
