import { Request, Response } from "express";
import User from "../models/userModel";
import { IUser } from "../types/userType";
import nodemailer from "nodemailer";
import transporter from "../utils/nodemailer";
import { registerValidator } from "../validators/userValidator";

class UserController {
  public static async register(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
      let user: IUser | null = await User.findOne({ email });

      if (user) {
        res.status(400).json({ message: "User already exists" });
      } else {
        user = new User({ email });
        await user.save();

        const mailOptions = {
          from: "admin@example.com",
          to: email,
          subject: "Please verify your email address",
          text: `Hello, please click on the following link to verify your email address: http://localhost:8000/api/auth/verify?email=${email}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });

        res.json({ message: "User registered successfully" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async verifyEmail(req: Request, res: Response): Promise<void> {
    const email: string = req.query.email as string;

    try {
      const user: IUser | null = await User.findOneAndUpdate(
        { email },
        { isVerified: true }
      );

      if (!user) {
        res.status(400).json({ message: "Invalid email address" });
      } else {
        res.json({ message: "Email verified successfully" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default UserController;
