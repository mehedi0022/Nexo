import nodemailer, { Transporter } from "nodemailer";
import { env } from "./env.js";

class EmailTransporter {
  private static instance: Transporter;

  static getInstance(): Transporter {
    if (!EmailTransporter.instance) {
      EmailTransporter.instance = nodemailer.createTransport({
        host: env.smtpMailHost,
        port: env.smtpMailPort,
        secure: env.smtpMailPort === 465,
        auth: {
          user: env.smtpMailUser,
          pass: env.smtpMailPass,
        },
      });
    }
    return EmailTransporter.instance;
  }

  static async verify(): Promise<void> {
    try {
      await EmailTransporter.getInstance().verify();
      console.log("✅ Mail server connected");
    } catch (error) {
      console.error("❌ Mail server connection failed:", error);
    }
  }
}

export const transporter = EmailTransporter.getInstance();
export const verifyMailConnection = EmailTransporter.verify;
