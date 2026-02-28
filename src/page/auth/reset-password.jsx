import {resetPassword} from "../../api/authapi"
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../styles/index.css";

const ResetPassword = () => {
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const otp = location.state?.otp;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirm) {
            setError("Mật khẩu và xác nhận không khớp");
            return;
        }
        setLoading(true);
        try {
            await resetPassword({ email, otp, newPassword: password });
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Đặt mật khẩu mới</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;

  