import { db } from "../../src/config/db.js";
import { seedAdmin } from "./adminSeeder.js";

const main = async () => {
  console.log("🌱 Seeding started...");

  await seedAdmin();

  console.log("✅ Seeding completed");
};

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
