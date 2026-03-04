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
FriendSchema.pre("save", function () {
  const a = this.userA.toString();
  const b = this.userB.toString();

  if (a > b) {
    const temp = this.userA;
    this.userA = this.userB;
    this.userB = temp;
  }

});

FriendSchema.index({ userA: 1, userB: 1 }, { unique: true });

export default mongoose.model("Friend", FriendSchema);