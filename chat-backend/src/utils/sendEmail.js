import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
  // make sure the environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const msg = "Missing email credentials. Set EMAIL_USER and EMAIL_PASS in your environment.";
    console.error(msg);
    throw new Error(msg);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Zely Support" <${process.env.EMAIL_USER}>`,
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