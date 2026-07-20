import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    otp: { type: String, default: "0" },
    otpExpiresAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

const users = mongoose.model("users", userSchema);

export default users;
