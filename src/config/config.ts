import * as dotenv from "dotenv";
dotenv.config();
export const config = {
  mongoDb: {
    URI: process.env.MONGO_URI,
  },
  mailTrap: {
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  },
  PORT: process.env.PORT,
};
