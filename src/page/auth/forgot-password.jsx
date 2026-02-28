import {useState} from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/authapi";
import "../../styles/index.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // 👈 DÒNG NÀY
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
          try {
            console.log("sending forgot-password for email", email);
            await forgotPassword(email);
            setMessage("OTP đã được gửi về email của bạn!");
            
            // chuyển sang trang nhập OTP
            setTimeout(() => {
                navigate("/verify", { state: { email } });
            }, 1500);

            } catch (err) {
            console.error("forgot-password error:", err);
            setError(err.message);
            } finally {
            setLoading(false);
            }
        }; 
     return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Quên mật khẩu</h2>
        <p>Nhập email để nhận mã OTP</p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;