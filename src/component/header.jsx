import "../styles/index.css";
import { FaHome, FaBell, FaUser } from "react-icons/fa";

const Header = () => {
  return (
    <div className="header">
      <div className="header-left">
        <div className="logo-box">MB</div>
        <span className="brand">Your Brand</span>
      </div>

      <div className="header-right">
        <FaHome className="icon" />
        <FaBell className="icon" />
        <FaUser className="icon" />

        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="avatar"
        />
      </div>
    </div>
  );
};

export default Header;