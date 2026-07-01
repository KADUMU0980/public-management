const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `CitizenConnect <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html
    });
    return info;
  } catch (error) {
    console.error('Email error:', error.message);
    // Don't throw - email failure shouldn't break the app
  }
};

const emailTemplates = {
  verification: (name, url) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:40px 20px;">
      <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:white;margin:0;font-size:28px;">🏛️ CitizenConnect</h1>
        <p style="color:#bfdbfe;margin:8px 0 0;">Smart Public Complaint Portal</p>
      </div>
      <div style="background:white;padding:30px;border-radius:0 0 12px 12px;">
        <h2 style="color:#1e40af;">Welcome, ${name}!</h2>
        <p style="color:#374151;">Please verify your email address to activate your account.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${url}" style="background:linear-gradient(135deg,#1e40af,#3b82f6);color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Verify Email Address</a>
        </div>
        <p style="color:#6b7280;font-size:14px;">This link expires in 24 hours.</p>
      </div>
    </div>`,

  resetPassword: (name, url) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:40px 20px;">
      <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:white;margin:0;">🏛️ CitizenConnect</h1>
      </div>
      <div style="background:white;padding:30px;border-radius:0 0 12px 12px;">
        <h2 style="color:#1e40af;">Password Reset</h2>
        <p style="color:#374151;">Hi ${name}, click below to reset your password.</p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${url}" style="background:#dc2626;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Reset Password</a>
        </div>
        <p style="color:#6b7280;font-size:14px;">This link expires in 10 minutes.</p>
      </div>
    </div>`,

  statusUpdate: (name, complaintId, status, remark) => `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:40px 20px;">
      <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:30px;border-radius:12px 12px 0 0;text-align:center;">
        <h1 style="color:white;margin:0;">🏛️ CitizenConnect</h1>
      </div>
      <div style="background:white;padding:30px;border-radius:0 0 12px 12px;">
        <h2 style="color:#1e40af;">Complaint Status Update</h2>
        <p>Hi ${name}, your complaint <strong>${complaintId}</strong> status has been updated to <strong>${status}</strong>.</p>
        ${remark ? `<p style="background:#f0f9ff;padding:15px;border-radius:8px;border-left:4px solid #3b82f6;color:#374151;">${remark}</p>` : ''}
      </div>
    </div>`
};

module.exports = { sendEmail, emailTemplates };
