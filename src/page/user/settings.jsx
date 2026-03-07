import { useNavigate } from "react-router-dom";
import "../../styles/index.css";
import {logoutUser} from "../../api/authapi.jsx";


const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <h2>Cài đặt</h2>

      <button onClick={() => navigate("/profile")}>
        Xem thông tin cá nhân
      </button>

      <button onClick={() => navigate("/change-password")}>
        Đổi mật khẩu
      </button>

      <button 
        className="logout-btn"
        onClick={() => {
          logoutUser();
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
};


export default Settings;