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

const changeAvatar = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id; // use consistent id property
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
export { changeAvatar };

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