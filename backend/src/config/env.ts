const parsePort = (value: string | undefined, fallback: number) => {
  const port = Number(value);

  return Number.isInteger(port) && port > 0 ? port : fallback;
};

export const env = {
  port: parsePort(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "*",

  smtpMailHost: process.env.SMTP_MAIL_HOST!,
  smtpMailPort: parsePort(process.env.SMTP_MAIL_PORT, 587),
  smtpMailUser: process.env.SMTP_MAIL_USER!,
  smtpMailPass: process.env.SMTP_MAIL_PASS!,
  smtpMailFromName: process.env.SMTP_MAIL_FROM_NAME!,
};
