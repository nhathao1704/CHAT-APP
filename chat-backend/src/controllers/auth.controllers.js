import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTPEmail } from "../utils/sendEmail.js";
const registerUser = async (req, res) => {
    try {
        console.log("BODY:", req.body);

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // kiem tra email va username da ton tai chua
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use" });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }
        // ma hoa mat khau
        const hashedPassword = await bcrypt.hash(password, 10);
        // tao user moi (avatar mặc định từ schema nếu không truyền)
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            isOnline: false
        });

        res.status(201).json({ message: "User registered successfully", userId: user._id, avatar: user.avatar });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

export { registerUser };

const LoginUser = async (req, res) => {
    try{
        const{ email,password }= req.body;
        if(!email||!password){
            return res.status(400).json({ message: 'All fields are required' });
        }
        // kiem tra email co ton tai khong
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // so sanh mat khau
        const ssmatkhau = await bcrypt.compare(password,user.password);
        if(!ssmatkhau){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // tao token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token, userId: user._id, username: user.username, avatar: user.avatar });
    }
    catch(error){
        res.status(500).json({ message: 'Server error', error });
    }
};

export { LoginUser };

const Forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Forgotpassword request received for:', email);
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // OTP hết hạn sau 5 phút
        user.otp = otp;
        user.otpExpire = otpExpire;
        await user.save();
        try {
            await sendOTPEmail(email, otp);
            res.status(200).json({ message: 'OTP đã được gửi đến email của bạn' });
        } catch (mailErr) {
            console.error('Error sending OTP email:', mailErr);
            // optionally clear otp fields if mailing fails
            user.otp = null;
            user.otpExpire = null;
            await user.save();
            return res.status(500).json({ message: 'Không thể gửi email OTP. Vui lòng thử lại sau.', error: mailErr.message });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
export { Forgotpassword };

const VerifyOtp = async (req, res) => {
    try{
        console.log('VerifyOtp request body:', req.body);
        const { email, otp,  } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }
        if (user.otp !== otp || user.otpExpire < new Date()) {
            return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
        }
        res.status(200).json({ message: 'OTP hợp lệ, bạn có thể đặt lại mật khẩu' });
    } catch (error) {
        console.error('VerifyOtp error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
    
 export { VerifyOtp };

const ResetPassword = async (req, res) => {
    try {
        console.log('ResetPassword body:', req.body);
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Thiếu dữ liệu, kiểm tra lại' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }
        // optionally verify the otp matches and not expired - security check
        if (user.otp !== otp || user.otpExpire < new Date()) {
            return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpire = null;
        await user.save();
        res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công' });
    } catch (error) {
        console.error('ResetPassword error:', error);
        res.status(500).json({ message: 'Server error', error });
    }   };
export { ResetPassword };

