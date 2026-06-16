import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

import { env } from "./env.js";

class Database {
  private static instance: PrismaClient;

  static getInstance(): PrismaClient {
    if (!Database.instance) {
      const adapter = new PrismaMariaDb(env.databaseUrl);

      Database.instance = new PrismaClient({
        adapter,
        log:
          process.env.NODE_ENV === "development"
            ? ["query", "error", "warn"]
            : ["error"],
      });
    }
    return Database.instance;
  }
}

export const db = Database.getInstance();
