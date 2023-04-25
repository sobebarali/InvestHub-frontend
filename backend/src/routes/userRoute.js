"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const userRoute = express_1.default.Router();
exports.userRoute = userRoute;
/**
 * @Method POST
 * @description User Registration
 * @body {String} email - email of the user
 * @body {String} password - password of the user
 * @returns {Object} returns "User registered successfully" response
 */
userRoute.post("/auth/register", userController_1.default.register);
/**
 * @Method POST
 * @description User Login
 * @body {String} email - email of the user
 * @body {String} password - password of the user
 * @returns {Object} returns "User logged in successfully" response
 */
userRoute.post("/auth/login", userController_1.default.login);
/**
 * @Method POST
 * @description verify email from the user
 * @query {String} email - email of the user
 * @returns {Object} returns "Email verified successfully" response
 */
userRoute.get("/auth/verify", userController_1.default.verifyEmail);
/**
 * @Method GET
 * @description login user with google
 */
userRoute.get("/auth/google", userController_1.default.googleAuth);
/**
 * @Method GET
 * @description callback route for google to redirect to
 * @returns {Object} returns "User registered successfully" response
 */
userRoute.get("/oauth2/callback", userController_1.default.googleAuthCallback);
