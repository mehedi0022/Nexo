import { env } from "./config/env.js";
import { db } from "./config/db.js";
import { verifyMailConnection } from "./config/nodemailer.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";

const startServer = async () => {
  try {
    await connectRedis();
    const { default: app } = await import("./app.js");

    await db.$connect();
    console.log("✅ Database connected");
    await verifyMailConnection().catch((error) => {
      console.warn("⚠️ Mail server unavailable:", error.message);
      console.warn("⚠️ Emails will not be sent until mail is restored");
    });
    app.listen(env.port, () => {
      console.log(
        `🚀 Server running on port ${env.port} in ${env.nodeEnv} mode`,
      );
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

const shutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  try {
    await db.$disconnect();
    await disconnectRedis();
    console.log("✅ Cleanup complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Shutdown error:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
