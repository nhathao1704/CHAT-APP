import "../styles/index.css";
import { FaHome, FaBell, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserProfile } from "../api/userapi";
import { getFriendRequests } from "../api/friend";

const Header = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(localStorage.getItem('avatar') || "https://i.imgur.com/WxNkK7J.png");
  const [notifCount, setNotifCount] = useState(0);

  // load friend-request count and optionally poll
  useEffect(() => {
    const loadCount = async () => {
      try {
        const list = await getFriendRequests();
        setNotifCount(Array.isArray(list) ? list.length : 0);
      } catch (e) {
        console.error('notif count fetch', e);
      }
    };
    loadCount();
    const interval = setInterval(loadCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // listen to dispatched updates from other components
  useEffect(() => {
    const handler = (e) => {
      setNotifCount(e.detail || 0);
    };
    window.addEventListener('notificationsUpdated', handler);
    return () => window.removeEventListener('notificationsUpdated', handler);
  }, []);

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
        <div className="logo-box">ZL</div>
        <span className="brand">ZOLA</span>
      </div>

      <div className="header-right">
        <button className="icon-btn" onClick={() => navigate("/home")}>
          <FaHome className="icon" />
        </button>
        <button
          className="icon-btn"
          style={{ position: "relative" }}
          onClick={() => navigate("/notifications")}
        >
          <FaBell className="icon" />
          {notifCount > 0 && (
            <span className="badge">{notifCount}</span>
          )}
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