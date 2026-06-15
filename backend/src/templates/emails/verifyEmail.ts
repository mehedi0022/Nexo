export const verifyEmailTemplate = (otp: string, name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 500px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 32px; }
    .otp { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #4F46E5; text-align: center; margin: 24px 0; }
    .footer { font-size: 12px; color: #999; text-align: center; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hi ${name}, Welcome! 👋</h2>
    <p>Your email verification OTP:</p>
    <div class="otp">${otp}</div>
    <p>This OTP will expire in <b>10 minutes.</b></p>
    <p>If you didn't register, ignore this email.</p>
    <div class="footer">© 2025 Your Shop. All rights reserved.</div>
  </div>
</body>
</html>
`;
