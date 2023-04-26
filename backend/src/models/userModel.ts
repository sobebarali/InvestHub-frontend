import { Schema, model } from "mongoose";
import { IUser } from "../types/userType";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ["shareholder", "investor"] },
  watchlist: [{ type: Schema.Types.ObjectId, ref: "Company" }],
  isVerified: { type: Boolean, default: false },
});

const User = model<IUser>("User", UserSchema);

export default User;
