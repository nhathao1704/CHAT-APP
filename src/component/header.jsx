import "../styles/index.css";
import { FaHome, FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserProfile } from "../api/userapi";

const Header = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || "https://i.pravatar.cc/40");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // fetch latest profile to ensure avatar is current
    getUserProfile()
      .then((data) => {
        if (data?.avatar) {
          setAvatar(data.avatar);
          localStorage.setItem('avatar', data.avatar);
        }
      })
      .catch(() => {
        // ignore errors; header will fallback to localStorage/default
      });

    const onAvatarChanged = (e) => {
      const newAvatar = e?.detail;
      if (newAvatar) setAvatar(newAvatar);
    };

    window.addEventListener('avatarChanged', onAvatarChanged);
    return () => window.removeEventListener('avatarChanged', onAvatarChanged);
  }, []);

  return (
    <div className="header">
      <div className="header-left">
        <div className="logo-box">MB</div>
        <span className="brand">Your Brand</span>
      </div>

      <div className="header-right">
        <button className="icon-btn" onClick={() => navigate("/home")}>
          <FaHome className="icon" />
        </button>
        <button className="icon-btn">
          <FaBell className="icon" />
        </button>
        <button className="icon-btn">
          <FaUser className="icon" />
        </button>

        <button className="avatar-btn" onClick={() => navigate("/settings")}>
          <img
            src={avatar}
            alt="avatar"
            className="avatar"
          />
        </button>
      
      </div>
    </div>
  );
};

export default Header;