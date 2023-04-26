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
const companyModel_1 = __importDefault(require("../models/companyModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const notification_1 = require("../utils/notification");
class CompanyController {
    static createCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                let { name, description } = req.body;
                if (!name) {
                    return res
                        .status(400)
                        .json({ message: "Please provide a company name." });
                }
                name = name.replace(/\s/g, "");
                const company = new companyModel_1.default({ name, description, shareholder: userId });
                const snsTopicArn = yield (0, notification_1.createSnsTopic)(name);
                company.snsTopicArn = snsTopicArn;
                yield company.save();
                res.status(201).json(company);
            }
            catch (error) {
                res.status(500).json({ message: "Server error" });
            }
        });
    }
    static updateCompany(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyId = req.params.id;
                const userId = req.userId;
                const { name, description } = req.body;
                const company = yield companyModel_1.default.findOne({
                    _id: companyId,
                    shareholder: userId,
                });
                if (!company) {
                    return res.status(404).json({ message: "Company not found." });
                }
                if (name) {
                    company.name = name;
                }
                if (description) {
                    company.description = description;
                }
                yield company.save();
                res.status(200).json(company);
            }
            catch (error) {
                res.status(500).json({ message: "Server error" });
            }
        });
    }
    static getCompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companies = yield companyModel_1.default.find();
                res.status(200).json(companies);
            }
            catch (error) {
                res.status(500).json({ message: "Server error" });
            }
        });
    }
    static addToWatchlist(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const companyId = req.params.id;
            try {
                const company = yield companyModel_1.default.findById(companyId);
                if (!company) {
                    return res.status(404).json({ message: "Company not found" });
                }
                const user = yield userModel_1.default.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                if (!user.watchlist.some((item) => item._id.equals(company._id))) {
                    user.watchlist.push(company);
                    yield user.save();
                }
                const subscriptions = yield notification_1.sns
                    .listSubscriptionsByTopic({ TopicArn: company.snsTopicArn })
                    .promise();
                const isSubscribed = (_a = subscriptions === null || subscriptions === void 0 ? void 0 : subscriptions.Subscriptions) === null || _a === void 0 ? void 0 : _a.some((item) => item.Endpoint === user.email);
                if (!isSubscribed) {
                    yield (0, notification_1.subscribeToSnsTopic)(company.snsTopicArn, "email", user.email);
                }
                res.status(200).json({ message: "Company added to watchlist" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static removeFromWatchlist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.userId;
            const companyId = req.params.id;
            try {
                const user = yield userModel_1.default.findById(userId);
                // Check if the user exists
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                // Remove the company from the user's watchlist
                user.watchlist = user.watchlist.filter((item) => !item._id.equals(companyId));
                yield user.save();
                res.status(200).json({ message: "Company removed from watchlist" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static addCompanyUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyId = req.params.id;
                const userId = req.userId;
                const { content } = req.body;
                if (!content) {
                    return res
                        .status(400)
                        .json({ message: "Please provide update content." });
                }
                const company = yield companyModel_1.default.findOne({
                    _id: companyId,
                    shareholder: userId,
                });
                if (!company) {
                    return res.status(404).json({ message: "Company not found." });
                }
                company.updates.push({ content, date: new Date() });
                const params = {
                    TopicArn: company.snsTopicArn,
                    Message: content,
                };
                yield notification_1.sns.publish(params).promise();
                yield company.save();
                res.status(201).json({ message: "Update added." });
            }
            catch (error) {
                res.status(500).json({ message: "Server error" });
            }
        });
    }
    static getCompanyUpdates(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const companyId = req.params.id;
                const company = yield companyModel_1.default.findById(companyId);
                if (!company) {
                    return res.status(404).json({ message: "Company not found." });
                }
                res.status(200).json(company.updates);
            }
            catch (error) {
                res.status(500).json({ message: "Server error" });
            }
        });
    }
}
exports.default = CompanyController;
