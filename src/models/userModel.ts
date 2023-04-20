import { Schema, model, Document } from "mongoose";
import { IUser } from "../types/userType";

const UserSchema = new Schema({
  email: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
});

const User = model<IUser>("User", UserSchema);

export default User;
