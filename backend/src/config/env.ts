import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "SMTP_MAIL_HOST",
  "SMTP_MAIL_PORT",
  "SMTP_MAIL_USER",
  "SMTP_MAIL_PASS",
  "SMTP_MAIL_FROM_NAME",
  "DATABASE_URL",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_FIRST_NAME",
  "ADMIN_LAST_NAME",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
];

for (const varName of requiredEnvVars) {
  if (!process.env[varName]) {
    throw new Error(`Environment variable ${varName} is required but not set.`);
  }
}

const parsePort = (value: string | undefined, fallback: number) => {
  const port = Number(value);

  return Number.isInteger(port) && port > 0 ? port : fallback;
};

export const env = {
  port: parsePort(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL!,

  adminEmail: process.env.ADMIN_EMAIL!,
  adminPassword: process.env.ADMIN_PASSWORD!,
  adminFirstName: process.env.ADMIN_FIRST_NAME!,
  adminLastName: process.env.ADMIN_LAST_NAME!,

  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "15m",

  smtpMailHost: process.env.SMTP_MAIL_HOST!,
  smtpMailPort: parsePort(process.env.SMTP_MAIL_PORT, 587),
  smtpMailUser: process.env.SMTP_MAIL_USER!,
  smtpMailPass: process.env.SMTP_MAIL_PASS!,
  smtpMailFromName: process.env.SMTP_MAIL_FROM_NAME!,
};
