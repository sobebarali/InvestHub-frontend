import { Schema, model } from "mongoose";
import { ICompany } from "../types/companyType";

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  updates: [{ content: String, date: Date }],
  snsTopicArn: { type: String },
  shareholder: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Company = model<ICompany>("Company", companySchema);
export default Company;
