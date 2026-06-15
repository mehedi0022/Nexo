import type { Express } from "express";
import { Router } from "express";

import { getHealth } from "../controllers/healthController";

const router = Router();

router.get("/health", getHealth);

export const registerRoutes = (app: Express) => {
  app.get("/", (_req, res) => {
    res.json({
      message: "Ecommerce API is running"
    });
  });

  app.use("/api", router);
};

export default router;
