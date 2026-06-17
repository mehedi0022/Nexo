import express from "express";

import {
  registerErrorHandlers,
  registerMiddlewares,
} from "./middlewares/index.js";
import { registerRoutes } from "./routes/index.js";
import { globalLimiter } from "./config/rateLimiter.js";

const app = express();

app.use(globalLimiter);
registerMiddlewares(app);
registerRoutes(app);
registerErrorHandlers(app);

export default app;
