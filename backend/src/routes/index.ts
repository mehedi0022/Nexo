import type { Express } from "express";

import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";
import paymentRoutes from "./payment.routes.js";
import userRoutes from "./user.routes.js";
import reviewRoutes from "./review.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

export const registerRoutes = (app: Express) => {
  // Health check
  app.get("/", (_req, res) => {
    res
      .status(200)
      .json({ success: "true", message: "Nexo E-commerce API is running" });
  });

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", productRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/dashboard", dashboardRoutes);
};
