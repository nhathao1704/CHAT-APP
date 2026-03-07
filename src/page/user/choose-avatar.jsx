import { useNavigate } from "react-router-dom";
import { chooseAvatar } from "../../api/userapi";
import "../../styles/index.css";
import avatar1 from "../../avatar-img/avatar1.jpg";
import avatar2 from "../../avatar-img/avatar2.jpg";
import avatar3 from "../../avatar-img/avatar3.jpg";
import avatar4 from "../../avatar-img/avatar4.jpg";
import avatar5 from "../../avatar-img/avatar5.jpg";
import avatar6 from "../../avatar-img/avatar6.jpg";

const avatarList = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
];

const ChooseAvatar = () => {
  const navigate = useNavigate();

  const handleSelect = async (avatar) => {
    try {
      const res = await chooseAvatar(avatar);

      if (res?.avatar) {
        localStorage.setItem("avatar", res.avatar);

        window.dispatchEvent(
          new CustomEvent("avatarChanged", { detail: res.avatar })
        );
      }

      navigate("/profile");

    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="avatar-container">

      <div className="avatar-box">

        <h2>Choose Your Avatar</h2>

        <div className="avatar-grid">

          {avatarList.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              className="avatar-item"
              onClick={() => handleSelect(avatar)}
            />
          ))}

        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/profile")}
        >
          Back
        </button>

      </div>

    </div>
  );
};

export default ChooseAvatar;