import mongoose from "mongoose";
import { config } from "../config/config";

const uri: string = config.mongoDb.URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (err) {
    process.exit(1);
  }
};

export default connectDB;
