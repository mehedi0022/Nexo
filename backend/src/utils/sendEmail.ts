import { transporter } from "../config/nodemailer";
import { verifyEmailTemplate } from "../templates/emails/verifyEmail";
import { orderConfirmationTemplate } from "../templates/emails/orderConfirmation";

export const sendVerificationEmail = async (
  to: string,
  name: string,
  otp: string,
) => {
  await transporter.sendMail({
    from: `"Your Shop" <${process.env.MAIL_USER}>`,
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
    from: `"Your Shop" <${process.env.MAIL_USER}>`,
    to,
    subject: `Order Confirmed - #${orderNumber}`,
    html: orderConfirmationTemplate(name, orderNumber, items, total),
  });
};
