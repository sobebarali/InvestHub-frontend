import { Document } from "mongoose";
import { ICompany } from "./companyType";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "shareholder" | "investor";
  watchlist: ICompany[];
  isVerified: boolean;
}
