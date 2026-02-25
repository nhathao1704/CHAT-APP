import User from "../models/User.js";
import bcrypt from "bcryptjs";

const getuserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select('-password'); // select ("-password") loai bo field password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }      };

export { getuserProfile };

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, email, avatar } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } 
        else {
        user.username = username || user.username;
        user.email = email || user.email;
        user.avatar = avatar || user.avatar;
        await user.save();
        res.status(200).json({ message: 'Profile updated successfully' });}
    }catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export { updateUserProfile };

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export { getAllUsers };

const changeUserPassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }   
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }   };

export { changeUserPassword };