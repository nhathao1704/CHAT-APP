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
};

export { registerUser, loginUser, logoutUser };
