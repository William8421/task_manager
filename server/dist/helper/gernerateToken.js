"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET || "default_secret";
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, secretKey, { expiresIn: "24h" });
}
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, secretKey);
    }
    catch (error) {
        return null;
    }
}
