import mongoose from "mongoose";

const FriendSchema = new mongoose.Schema(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Đảm bảo userA luôn nhỏ hơn userB để tránh trùng
FriendSchema.pre("save", function (next) {
  const a = this.userA.toString();
  const b = this.userB.toString();

  if (a > b) {
    this.userA = new mongoose.Types.ObjectId(b);
    this.userB = new mongoose.Types.ObjectId(a);
  }

  next();
});

FriendSchema.index({ userA: 1, userB: 1 }, { unique: true });

export default mongoose.model("Friend", FriendSchema);