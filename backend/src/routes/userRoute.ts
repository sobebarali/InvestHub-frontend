import express, { Router } from "express";
import userController from "../controllers/userController";

const userRoute: Router = express.Router();

/**
 * @Method POST
 * @description User Registration
 * @body {String} email - email of the user
 * @body {String} password - password of the user
 * @returns {Object} returns "User registered successfully" response
 */

userRoute.post("/auth/register", userController.register);

/**
 * @Method POST
 * @description User Login
 * @body {String} email - email of the user
 * @body {String} password - password of the user
 * @returns {Object} returns "User logged in successfully" response
 */

userRoute.post("/auth/login", userController.login);

/**
 * @Method POST
 * @description verify email from the user
 * @query {String} email - email of the user
 * @returns {Object} returns "Email verified successfully" response
 */
userRoute.get("/auth/verify", userController.verifyEmail);

/**
 * @Method GET
 * @description login user with google
 */
userRoute.get("/auth/google", userController.googleAuth);

/**
 * @Method GET
 * @description callback route for google to redirect to
 * @returns {Object} returns "User registered successfully" response
 */
userRoute.get("/oauth2/callback", userController.googleAuthCallback);

export { userRoute };
