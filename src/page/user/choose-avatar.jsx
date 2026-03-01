import { useNavigate } from "react-router-dom";
import { chooseAvatar } from "../../api/userapi";

const avatarList = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
];

const ChooseAvatar = () => {
  const navigate = useNavigate();

  const handleSelect = async (avatar) => {
    try {
      const res = await chooseAvatar(avatar);
      // persist avatar locally and notify listeners (Header)
      if (res?.avatar) {
        localStorage.setItem('avatar', res.avatar);
        window.dispatchEvent(new CustomEvent('avatarChanged', { detail: res.avatar }));
      }
      navigate("/home");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <h2>Chọn Avatar</h2>
      {avatarList.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          width="80"
          style={{ cursor: "pointer", margin: "10px" }}
          onClick={() => handleSelect(avatar)}
        />
      ))}
    </div>
  );
};

export default ChooseAvatar;