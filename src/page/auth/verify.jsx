import {verifyOtp} from "../../api/authapi"
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../styles/index.css";

const VerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await verifyOtp({ email, otp });
            // forward OTP so reset-password can send it back
            navigate("/reset-password", { state: { email, otp } });
        }
        catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

    };  
     return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Nhập mã OTP</h2>
        <p>Vui lòng kiểm tra email và nhập mã xác nhận.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nhập mã OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang xác nhận..." : "Xác nhận"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;