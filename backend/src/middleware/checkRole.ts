import { Request, Response } from "express";
import { config } from "../config/config";
const jwt = require("jsonwebtoken");

export const requireRole = (role: "shareholder" | "investor") => {
  return (req: Request, res: Response, next: () => void) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, config.jwt.SECRET) as {
        userId: string;
        role: string;
      };

      if (decoded.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }

      (req as any).userId = decoded.userId;

      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};
