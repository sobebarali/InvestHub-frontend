const request = require("supertest");
import User from "../models/userModel";
import app from "../app";

describe("UserController", () => {
  describe("POST /api/auth/register", () => {
    const email = Math.random().toString(36).substring(2) + "@example.com";
    it("should register a new user and send verification email", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({ email })
        .expect(200);

      expect(response.body).toEqual({
        message: "User registered successfully",
      });

      const user = await User.findOne({ email });
      expect(user).toBeDefined();
      expect(user?.isVerified).toBe(false);
    });

    it("should return an error if user already exists", async () => {
      const user = new User({ email: "test@example.com" });
      await user.save();

      const response = await request(app)
        .post("/api/auth/register")
        .send({ email })
        .expect(400);

      expect(response.body).toEqual({ message: "User already exists" });
    });
  });
});
