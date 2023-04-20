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
class UserController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                let user = yield userModel_1.default.findOne({ email });
                if (user) {
                    res.status(400).json({ message: "User already exists" });
                }
                else {
                    user = new userModel_1.default({ email });
                    yield user.save();
                    const mailOptions = {
                        from: "admin@example.com",
                        to: email,
                        subject: "Please verify your email address",
                        text: `Hello, please click on the following link to verify your email address: http://localhost:8000/api/auth/verify?email=${email}`,
                    };
                    nodemailer_1.default.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                    });
                    res.json({ message: "User registered successfully" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.query.email;
            try {
                const user = yield userModel_1.default.findOneAndUpdate({ email }, { isVerified: true });
                if (!user) {
                    res.status(400).json({ message: "Invalid email address" });
                }
                else {
                    res.json({ message: "Email verified successfully" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.default = UserController;
