import { Document, ObjectId } from "mongoose";

export interface ICompany extends Document {
  name: string;
  description: string;
  updates: { content: string; date: Date }[];
  snsTopicArn: string;
  shareholder: ObjectId;
}
