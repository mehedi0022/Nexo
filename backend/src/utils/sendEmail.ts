import { env } from "../config/env.js";
import { transporter } from "../config/nodemailer.js";
import { verifyEmailTemplate } from "../templates/emails/verifyEmail.js";
import { orderConfirmationTemplate } from "../templates/emails/orderConfirmation.js";

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `${env.smtpMailFromName} <${env.smtpMailUser}>`,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (
  to: string,
  name: string,
  otp: string,
) => {
  await transporter.sendMail({
    from: `${env.smtpMailFromName} <${env.smtpMailUser}>`,
    to,
    subject: "Verify Your Email",
    html: verifyEmailTemplate(otp, name),
  });
};

export const sendOrderConfirmationEmail = async (
  to: string,
  name: string,
  orderNumber: string,
  items: any[],
  total: number,
) => {
  await transporter.sendMail({
    from: `${env.smtpMailFromName} <${env.smtpMailUser}>`,
    to,
    subject: `Order Confirmed - #${orderNumber}`,
    html: orderConfirmationTemplate(name, orderNumber, items, total),
  });
};
