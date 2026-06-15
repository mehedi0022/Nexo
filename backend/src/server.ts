import app from "./app";
import { env } from "./config/env";
import { verifyMailConnection } from "./config/nodemailer";

app.listen(env.port, async () => {
  console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  await verifyMailConnection();
});
