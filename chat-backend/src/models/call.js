import mongoose from "mongoose";
import Conversation from "./Conversation.js"

const callschema = new mongoose.Schema(
    { Conversation:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        require: true,
    },
    caller:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        requird:true,
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true,
    },
    type:{
        type:String,
        enum:["audio"],
        default: "audio",
    },
     status: {
      type: String,
      enum: [
        "ringing",
        "accepted",
        "rejected",
        "missed",
        "ended",
      ],
      default: "ringing",
    },
    startedAt: Date,
    endedAt: Date,
    duration: Number,
  },
  { timestamps: true }
);
export default mongoose.model("Call", callschema);

