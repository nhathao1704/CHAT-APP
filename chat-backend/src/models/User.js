import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar : { type: String, default: "https://i.pravatar.cc/150?img=10" },
    isOnline: { type: Boolean, default: false },
    otp: { type: String },
    otpExpire: { type: Date },
    }, 
    { 
        timestamps: true 
    }
);




export default mongoose.model('User', UserSchema);