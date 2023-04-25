"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer_1.default.createTransport({
    host: config_1.config.mailTrap.host,
    port: 2525,
    auth: {
        user: config_1.config.mailTrap.auth.user,
        pass: config_1.config.mailTrap.auth.pass,
    },
});
exports.default = transporter;
