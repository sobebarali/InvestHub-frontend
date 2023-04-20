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
const request = require("supertest");
const userModel_1 = __importDefault(require("../models/userModel"));
const app_1 = __importDefault(require("../app"));
describe("UserController", () => {
    describe("POST /api/auth/register", () => {
        const email = Math.random().toString(36).substring(2) + "@example.com";
        it("should register a new user and send verification email", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app_1.default)
                .post("/api/auth/register")
                .send({ email })
                .expect(200);
            expect(response.body).toEqual({
                message: "User registered successfully",
            });
            const user = yield userModel_1.default.findOne({ email });
            expect(user).toBeDefined();
            expect(user === null || user === void 0 ? void 0 : user.isVerified).toBe(false);
        }));
        it("should return an error if user already exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const user = new userModel_1.default({ email: "test@example.com" });
            yield user.save();
            const response = yield request(app_1.default)
                .post("/api/auth/register")
                .send({ email })
                .expect(400);
            expect(response.body).toEqual({ message: "User already exists" });
        }));
    });
});
