import express, { Router } from "express";
import userController from "../controllers/userController";

const userRoute: Router = express.Router();

/**
 * @Method POST
 * @description sends email to the user
 * @body {String} email - email of the user
 * @returns {Object} returns "User registered successfully" response
 */
userRoute.post("/auth/register", userController.register);

/**
 * @Method POST
 * @description verify email from the user
 * @query {String} email - email of the user
 * @returns {Object} returns "Email verified successfully" response
 */
userRoute.get("/auth/verify", userController.verifyEmail);

export { userRoute };
