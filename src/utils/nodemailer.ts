import nodemailer from "nodemailer";
import { config } from "../config/config";

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: config.mailTrap.host,
  port: 2525,
  auth: {
    user: config.mailTrap.auth.user,
    pass: config.mailTrap.auth.pass,
  },
});

export default transporter;
