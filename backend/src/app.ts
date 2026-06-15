import "dotenv/config";

import express from "express";

import { registerErrorHandlers, registerMiddlewares } from "./middlewares";
import { registerRoutes } from "./routes";

const app = express();

registerMiddlewares(app);
registerRoutes(app);
registerErrorHandlers(app);

export default app;
