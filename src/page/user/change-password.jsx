import { useNavigate } from "react-router-dom";
import { changePassword } from "../../api/userapi";
import { useState } from "react";
import "../../styles/index.css"
const ChangePassword = () => {
    const navigate = useNavigate();
    const[formData, setFormData] = useState({
        oldpassword:"",
        newpassword:"",
        confirmpassword:"",
    })
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const handleChange = (e) => {
        setFormData({
            ...formData,
          [e.target.name]: e.target.value,
         });
     };
     const handleSubmit = async (e)=>{
        e.preventDefaut();
        setError("");
        if (formData.newpassword !== formData.confirmpassword){
            setError("mat khau khong khop");
            return
        }
        try{
            await changePassword({
                oldpassword: FormData.oldpassword,
                newpassword: FormData.newpassword,
            })
            setMessage("Đổi mật khẩu thành công!");

            setFormData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra");
        }
  };
  return (
   <div className="change-password-wrapper">
        <div className="change-password-container">
            <h2>Đổi mật khẩu</h2>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Mật khẩu cũ</label>
                <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group">
                <label>Xác nhận mật khẩu</label>
                <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                />
            </div>

            <button type="submit">Đổi mật khẩu</button>
            <button onClick={()=>navigate("/forgot-password")}>
                quên mật khẩu
            </button>
            </form>
        </div>
    </div>
  );
};
export default ChangePassword