import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../../api/userapi";
import "../../styles/index.css"

const Profile = () => {

  const navigate = useNavigate();

  const [editData, setEditData] = useState({
    username: "",
    email: "",
    avatar: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();

        setEditData({
          username: data.username || "",
          email: data.email || "",
          avatar: data.avatar || ""
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      await updateUserProfile(editData);
      alert("Profile updated!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="profile-container">

      <div className="profile-box">

        <h2 className="profile-title">Profile</h2>

        <img
          src={editData.avatar || "https://i.pravatar.cc/150"}
          className="profile-avatar"
        />

        <button
          className="change-avatar-btn"
          onClick={() => navigate("/choose-avatar")}
        >
          Change Avatar
        </button>

        <input
          type="text"
          name="username"
          placeholder="Name"
          value={editData.username}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          value={editData.email}
          disabled
        />

        <button
          className="update-btn"
          onClick={handleUpdate}
        >
          Update Profile
        </button>

      </div>

    </div>
  );
};

export default Profile;