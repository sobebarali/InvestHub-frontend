"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["shareholder", "investor"] },
    watchlist: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Company" }],
    isVerified: { type: Boolean, default: false },
});
const User = (0, mongoose_1.model)("User", UserSchema);
exports.default = User;
