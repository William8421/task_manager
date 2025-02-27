"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Middleware function to validate JWT token
const validateToken = (req, res, next) => {
    var _a;
    // Get token from request header
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).send("Access denied. No token provided.");
    }
    try {
        // Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret");
        // If decoded is a string, parse it to a JavaScript object
        req.user = typeof decoded === "string" ? JSON.parse(decoded) : decoded;
        next(); // Proceed to next middleware
    }
    catch (error) {
        console.error("Token validation error:", error);
        return res.status(401).send("Invalid token.");
    }
};
exports.validateToken = validateToken;
