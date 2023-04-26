"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const config_1 = require("../config/config");
const jwt = require("jsonwebtoken");
const requireRole = (role) => {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        try {
            const decoded = jwt.verify(token, config_1.config.jwt.SECRET);
            if (decoded.role !== role) {
                return res.status(403).json({ message: "Forbidden" });
            }
            req.userId = decoded.userId;
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Unauthorized" });
        }
    };
};
exports.requireRole = requireRole;
