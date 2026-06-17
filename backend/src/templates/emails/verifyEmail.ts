export const verifyEmailTemplate = (otp: string, name: string) => {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      background-color: #f8fafc; 
      margin: 0; 
      padding: 0; 
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container { 
      max-width: 520px; 
      margin: 0 auto; 
      background: #ffffff; 
      border-radius: 12px; 
      padding: 40px; 
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    h2 {
      color: #1e293b;
      font-size: 22px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 16px;
    }
    h3 {
      color: #334155;
      font-size: 16px;
      font-weight: 600;
      margin: 24px 0 12px 0;
    }
    p {
      color: #475569;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }
    .otp-container {
      background-color: #f1f5f9;
      border-radius: 8px;
      padding: 18px;
      text-align: center;
      margin: 24px 0;
    }
    .otp { 
      font-size: 36px; 
      font-weight: 700; 
      letter-spacing: 8px; 
      color: #4f46e5; 
      padding-left: 8px; 
    }
    .expiry {
      font-size: 14px;
      color: #64748b;
      text-align: center;
      margin-bottom: 28px;
    }
    .feature-list {
      padding-left: 0;
      margin: 0 0 24px 0;
      list-style-type: none;
    }
    .feature-item {
      font-size: 14px;
      color: #475569;
      line-height: 1.5;
      margin-bottom: 10px;
      padding-left: 24px;
      position: relative;
    }
    .feature-item::before {
      content: "✓";
      position: absolute;
      left: 0;
      color: #10b981;
      font-weight: bold;
    }
    .help-card {
      background-color: #f8fafc;
      border-left: 4px solid #cbd5e1;
      padding: 12px 16px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    .help-card p {
      font-size: 14px;
      margin: 0;
      color: #64748b;
    }
    .divider {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 32px 0 24px 0;
    }
    .footer { 
      font-size: 13px; 
      color: #94a3b8; 
      text-align: center; 
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <h2>Hi ${name}, Welcome! 👋</h2>
      <p>Thank you for creating an account with us. We're excited to have you on board! To finish setting up your profile and ensure your account is secure, please verify your email address using the One-Time Password (OTP) below.</p>
      
      <div class="otp-container">
        <div class="otp">${otp}</div>
      </div>
      
      <p class="expiry">This verification code is valid for <b>10 minutes</b>. For account safety, please do not forward or share this code with anyone.</p>
      
      <h3>What's next?</h3>
      <p>Once your account is verified, you'll unlock full access to our platform, allowing you to:</p>
      <ul class="feature-list">
        <li class="feature-item">Explore and customize your personalized dashboard.</li>
        <li class="feature-item">Manage your orders, tracks, and preferences seamlessly.</li>
        <li class="feature-item">Receive exclusive member-only updates and early access features.</li>
      </ul>

      <div class="help-card">
        <p><b>Didn't request this?</b> If you did not sign up for an account, someone may have entered your email address by mistake. You can safely ignore this email; no account will be fully activated without this verification.</p>
      </div>

      <p>If you encounter any issues during the verification process, feel free to reply directly to this email—our support team is always ready to help.</p>
      
      <p>Best regards,<br><b>The Your Shop Team</b></p>
      
      <hr class="divider" />
      
      <div class="footer">
        &copy; ${currentYear} Your Shop. All rights reserved.<br>
        123 Business St, Suite 100, San Francisco, CA 94107
      </div>
    </div>
  </div>
</body>
</html>
`;
};
