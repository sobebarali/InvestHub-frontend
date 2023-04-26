"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    updates: [{ content: String, date: Date }],
    snsTopicArn: { type: String },
    shareholder: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
});
const Company = (0, mongoose_1.model)("Company", companySchema);
exports.default = Company;
