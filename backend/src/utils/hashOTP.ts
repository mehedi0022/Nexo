import crypto from "crypto";

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const compareOTP = (otp: string, hashedOTP: string): boolean => {
  const hash = crypto.createHash("sha256").update(otp).digest("hex");
  return hash === hashedOTP;
};
