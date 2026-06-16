import "dotenv/config";

import express from "express";

import { registerErrorHandlers, registerMiddlewares } from "./middlewares/index.js";
import { registerRoutes } from "./routes/index.js";

const app = express();

registerMiddlewares(app);
registerRoutes(app);
registerErrorHandlers(app);

export default app;
