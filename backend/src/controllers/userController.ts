import { Request, Response } from "express";
import User from "../models/userModel";
import { IUser } from "../types/userType";
import transporter from "../utils/nodemailer";
import { loginValidator, registerValidator } from "../validators/userValidator";
import { config } from "../config/config";
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const oAuth2Client = new OAuth2Client(
  config.google.CLIENT_ID,
  config.google.CLIENT_SECRET,
  config.google.REDIRECT_URI
);

class UserController {
  public static async register(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    const { error } = registerValidator.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const userExists = await UserController.checkIfUserExists(email);

      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const role =
        email.split("@")[1].split(".")[0] === "pitchground"
          ? "shareholder"
          : "investor";

      await UserController.createUser(email, hashedPassword, role);

      await UserController.sendVerificationEmail(email);
      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;

    const { error } = loginValidator.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      const comparePassword = await bcrypt.compare(password, user.password);

      if (!comparePassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        config.jwt.SECRET,
        {
          expiresIn: "24h",
        }
      );

      res.json({ message: "User logged in successfully", token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async googleAuth(req: Request, res: Response): Promise<any> {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
      ],
    });

    res.redirect(authUrl);
  }

  public static async googleAuthCallback(
    req: Request,
    res: Response
  ): Promise<any> {
    const { code } = req.query;

    try {
      const { tokens } = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokens);
      const idToken = tokens.id_token;

      await oAuth2Client.verifyIdToken({
        idToken,
        audience: config.google.CLIENT_ID,
      });

      const { data } = await oAuth2Client.request({
        url: "https://www.googleapis.com/oauth2/v1/userinfo",
        method: "GET",
      });

      const { email } = data;
      const userExists = await UserController.checkIfUserExists(email);

      const role =
        email.split("@")[1].split(".")[0] === "pitchground"
          ? "shareholder"
          : "investor";

      if (!userExists) {
        await UserController.createUserByGoogle(email, role);
        await UserController.updateUserVerificationStatus(email);
      }

      res.redirect("http://localhost:3000");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private static async checkIfUserExists(email: string): Promise<boolean> {
    const user: IUser | null = await User.findOne({ email });
    return !!user;
  }

  private static async createUserByGoogle(
    email: string,
    role: string
  ): Promise<void> {
    const user = new User({ email });
    await user.save();
  }

  private static async createUser(
    email: string,
    password: string,
    role: string
  ): Promise<void> {
    const user = new User({ email, password, role, isVerified: false });
    await user.save();
  }

  private static async sendVerificationEmail(email: string): Promise<void> {
    const html = `
    <div style="background-color: #f2f2f2; padding: 50px 0; text-align: center;">
        <div style="background-color: #fff; width: 50%; margin: 0 auto; padding: 50px 0;">
            <h1 style="color: #000;">Welcome to our website</h1>
            <p style="color: #000;">Please click on the following link to verify your email address</p>
            <a href="http://localhost:8000/api/auth/verify?email=${email}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none;">Verify email</a>
        </div>
    </div>
    `;

    const mailOptions = {
      from: "admin@example.com",
      to: email,
      subject: "Please verify your email address",
      html,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to send verification email");
    }
  }

  public static async verifyEmail(req: Request, res: Response): Promise<any> {
    const email: string = req.query.email as string;

    try {
      const userUpdated = await UserController.updateUserVerificationStatus(
        email
      );

      if (!userUpdated) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      res.redirect("http://localhost:3000");
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  private static async updateUserVerificationStatus(
    email: string
  ): Promise<boolean> {
    const user: IUser | null = await User.findOneAndUpdate(
      { email },
      { isVerified: true }
    );

    return !!user;
  }
}

export default UserController;
