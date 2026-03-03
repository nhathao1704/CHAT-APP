import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select(["email", "username", "avatar", "_id"]);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
export { getAllUsers };


const getUserprofile = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
export { getUserprofile };

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;
        const { username, email } = req.body;
        const user = await User.findByIdAndUpdate(userId, { username, email }, { new: true }).select("-password");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}   
export { updateUserProfile };

const isOnline = async (userId, status) => {
    try {
        await User.findByIdAndUpdate(userId, { isOnline: status }, { new: true });
    } catch (error) {
        console.error('Error updating online status:', error);
    }
}
export { isOnline };
const chooseAvatar = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id; 
        const { avatar } = req.body;
        const user = await User.findByIdAndUpdate(userId, { avatar }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Avatar updated successfully', avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
        }
    }
 export { chooseAvatar };

 const changePassword = async (req,res)=>{
    try{
       const userId = req.userId || req.user?.id; 
       const {oldPassword, newPassword} = req.body;
       if(!oldPassword || !newPassword){
        return res.status(400).json({message:"vui long nhap du thong"})
       }
       const user = await User.findById(userId)
       if(!user){
         return res.status(404).json({message:"khong tim thay user"})
       }
       // so sanh mk
       const ssmk = await bcrypt.compare (oldPassword, user.password);
       if(!ssmk){
        return res.status(400).json({message:"mk khong dung voi mk cu"})
       }
       // hash mk moi
        const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(newPassword, salt);
         user.password = hashedPassword;
         await user.save();
         res.status(200).json({message:"doi mk thanh cong"})

    }
    catch(error)
    {
        res.status(500).json({ message: 'Server error', error });
     }
    }
export {changePassword}
// tim kiem user
// tìm kiếm user theo từ khóa truyền qua query string
const searchUser = async (req, res) => {
    try {
        // keyword được gửi như ?keyword=foo
        const keyword = req.query.keyword;

        if (!keyword || keyword.trim().length === 0) {
            return res.status(400).json({ message: "Vui lòng cung cấp từ khóa tìm kiếm" });
        }

        // Tìm username hoặc email chứa keyword (không phân biệt hoa thường)
        // và loại trừ chính user đang tìm
        const currentUserId = req.userId || req.user?.id;
        const users = await User.find({
            _id: { $ne: currentUserId },
            $or: [
                { username: { $regex: keyword, $options: "i" } },
                { email: { $regex: keyword, $options: "i" } },
            ],
        })
            .select("-password -otp -otpExpire") // ẩn field nhạy cảm
            .limit(10); // giới hạn 10 kết quả

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
export {searchUser}