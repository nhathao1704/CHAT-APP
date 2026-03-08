import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const msg = "Missing email credentials. Set EMAIL_USER and EMAIL_PASS in your environment.";
    console.error(msg);
    throw new Error(msg);
  }

  const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
      port: 587,
      secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
     connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
  });

  try {
    await transporter.sendMail({
      from: `"Zola Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      html: `
        <h2>Mã OTP của bạn là:</h2>
        <h1>${otp}</h1>
        <p>Mã có hiệu lực trong 5 phút.</p>
      `,
    });
    console.log(`OTP email sent to ${email}`);
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    // rethrow so the controller can respond with 500
    throw err;
  }
};