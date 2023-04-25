"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String },
    isVerified: { type: Boolean, default: false },
});
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
