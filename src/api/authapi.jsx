const BASE_URL = "http://localhost:3000/api";

const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Đăng ký thất bại");
  }

  return data; // chỉ trả message
};

const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Đăng nhập thất bại");
  }

  // ✅ lưu token khi login
  localStorage.setItem("token", data.token);

  return data;
};

const logoutUser = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// quên mật khẩu gưi email để nhận OTP
const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();

  if (!res.ok) {
    // include backend error detail if available
    const errMsg = data.message || "Yêu cầu quên mật khẩu thất bại";
    const detail = data.error ? ` (${data.error})` : "";
    throw new Error(errMsg + detail);
  }
  return data;
};

// xác thực OTP
const verifyOtp = async ({ email, otp }) => {
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) {
    const errMsg = data.message || "Xác thực OTP thất bại";
    const detail = data.error ? ` (${data.error})` : "";
    throw new Error(errMsg + detail);
  }
  return data;
};

// đặt lại mật khẩu
const resetPassword = async ({ email, otp, newPassword }) => {
  const res = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp, newPassword }),    
  });
  const data = await res.json();
  if (!res.ok) {
    const errMsg = data.message || "Đặt lại mật khẩu thất bại";
    const detail = data.error ? ` (${data.error})` : "";
    throw new Error(errMsg + detail);
  }
  return data;
}
  
export { registerUser, loginUser, logoutUser, forgotPassword, verifyOtp, resetPassword };
