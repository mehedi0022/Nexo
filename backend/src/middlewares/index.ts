import type { Express } from "express";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./errorHandler.js";
import { corsOptions } from "../config/cors.js";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

export const registerMiddlewares = (app: Express) => {
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(apiLimiter);
};

export const registerErrorHandlers = (app: Express) => {
  app.use(notFoundHandler);
  app.use(errorHandler);
};
