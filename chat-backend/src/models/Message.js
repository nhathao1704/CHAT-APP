import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
   content : { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    }, 
    { 
        timestamps: true 
    }
);
export default mongoose.model('Message', MessageSchema);