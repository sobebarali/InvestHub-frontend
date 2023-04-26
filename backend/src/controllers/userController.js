"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const userValidator_1 = require("../validators/userValidator");
const config_1 = require("../config/config");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const oAuth2Client = new OAuth2Client(config_1.config.google.CLIENT_ID, config_1.config.google.CLIENT_SECRET, config_1.config.google.REDIRECT_URI);
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const { error } = userValidator_1.registerValidator.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            try {
                const userExists = yield UserController.checkIfUserExists(email);
                if (userExists) {
                    return res.status(400).json({ message: "User already exists" });
                }
                const hashedPassword = yield bcrypt.hash(password, 10);
                const role = email.split("@")[1].split(".")[0] === "pitchground"
                    ? "shareholder"
                    : "investor";
                yield UserController.createUser(email, hashedPassword, role);
                yield UserController.sendVerificationEmail(email);
                res.json({ message: "User registered successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const { error } = userValidator_1.loginValidator.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            try {
                const user = yield userModel_1.default.findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: "User does not exist" });
                }
                const comparePassword = yield bcrypt.compare(password, user.password);
                if (!comparePassword) {
                    return res.status(400).json({ message: "Invalid credentials" });
                }
                const token = jwt.sign({ userId: user._id, role: user.role }, config_1.config.jwt.SECRET, {
                    expiresIn: "24h",
                });
                res.json({ message: "User logged in successfully", token });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: "offline",
                scope: [
                    "https://www.googleapis.com/auth/userinfo.email",
                    "https://www.googleapis.com/auth/userinfo.profile",
                ],
            });
            res.redirect(authUrl);
        });
    }
    static googleAuthCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.query;
            try {
                const { tokens } = yield oAuth2Client.getToken(code);
                oAuth2Client.setCredentials(tokens);
                const idToken = tokens.id_token;
                yield oAuth2Client.verifyIdToken({
                    idToken,
                    audience: config_1.config.google.CLIENT_ID,
                });
                const { data } = yield oAuth2Client.request({
                    url: "https://www.googleapis.com/oauth2/v1/userinfo",
                    method: "GET",
                });
                const { email } = data;
                const userExists = yield UserController.checkIfUserExists(email);
                const role = email.split("@")[1].split(".")[0] === "pitchground"
                    ? "shareholder"
                    : "investor";
                if (!userExists) {
                    yield UserController.createUserByGoogle(email, role);
                    yield UserController.updateUserVerificationStatus(email);
                }
                res.redirect("http://localhost:3000");
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static checkIfUserExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ email });
            return !!user;
        });
    }
    static createUserByGoogle(email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new userModel_1.default({ email });
            yield user.save();
        });
    }
    static createUser(email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new userModel_1.default({ email, password, role, isVerified: false });
            yield user.save();
        });
    }
    static sendVerificationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
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
                yield nodemailer_1.default.sendMail(mailOptions);
            }
            catch (error) {
                console.error(error);
                throw new Error("Failed to send verification email");
            }
        });
    }
    static verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            try {
                const userUpdated = yield UserController.updateUserVerificationStatus(email);
                if (!userUpdated) {
                    return res.status(400).json({ message: "Invalid email address" });
                }
                res.redirect("http://localhost:3000");
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static updateUserVerificationStatus(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOneAndUpdate({ email }, { isVerified: true });
            return !!user;
        });
    }
}
exports.default = UserController;
