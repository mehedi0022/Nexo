import app from "./app.js";
import { env } from "./config/env.js";
import { verifyMailConnection } from "./config/nodemailer.js";

app.listen(env.port, async () => {
  console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  await verifyMailConnection();
});
