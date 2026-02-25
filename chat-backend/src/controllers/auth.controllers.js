import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const registerUser = async (req, res) => {
    try {
        const { username, email, password, } = req.body;
        if(!username||!email||!password){
            return res.status(400).json({ message: 'All fields are required' });
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            isOnline: false,
            avatar: "",

        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export { registerUser };

const LoginUser = async (req, res) => {
    try{
        const{ email,password }= req.body;
        if(!email||!password){
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const ssmatkhau = await bcrypt.compare(password,user.password);
        if(!ssmatkhau){
            return res.status(400).json({ message: 'Invalid credentials' });
        }
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

const forgetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });   
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }};

export { forgetPassword };