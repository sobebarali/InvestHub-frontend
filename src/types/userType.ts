import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  isVerified: boolean;
}
