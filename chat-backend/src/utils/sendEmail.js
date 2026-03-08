import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {

    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY in environment variables");
    }

    const response = await resend.emails.send({
      from: "Zola Support <onboarding@resend.dev>",
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      html: `
        <div style="font-family: Arial; padding:20px">
          <h2>Mã OTP của bạn</h2>
          <h1 style="color:#4CAF50">${otp}</h1>
          <p>Mã này có hiệu lực trong <b>5 phút</b>.</p>
          <p>Nếu bạn không yêu cầu đổi mật khẩu, hãy bỏ qua email này.</p>
        </div>
      `,
    });

    console.log("Email sent:", response);

  } catch (error) {

    console.error("Resend email error:", error);

    throw new Error(
      "Không thể gửi email OTP. Vui lòng thử lại sau."
    );
  }
};