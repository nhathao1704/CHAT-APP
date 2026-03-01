import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../api/authapi";
import "../../styles/login.css";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      console.log("Login successful:", response);
      // redirect back to the page user tried to access
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-right">
        <h1>zely 👋</h1>
        <p>Kết nối bạn bè, chia sẻ khoảnh khắc và trò chuyện mọi lúc mọi nơi.</p>
      </div>
      <div className="login-box">
        <h2>Đăng Nhập</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button type="submit" disabled={loading} >
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Chưa có tài khoản? <a href="/register">Đăng ký tại đây</a>
          </p>
          <p>
           <a href="/forgot-password">quên mật khẩu?</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
