import { db } from "../../src/config/db";
import { env } from "../../src/config/env";
import { hashPassword } from "../../src/utils/hashPassword";

export const seedAdmin = async () => {
  const existing = await db.user.findUnique({
    where: { email: env.adminEmail },
  });

  if (existing) {
    console.log("⏭️  Admin already exists — skipping");
    return;
  }

  await db.user.create({
    data: {
      email: env.adminEmail,
      password: await hashPassword(env.adminPassword),
      firstName: env.adminFirstName,
      lastName: env.adminLastName,
      role: "SUPER_ADMIN",
      isVerified: true,
    },
  });

  console.log("✅ Admin created");
};
