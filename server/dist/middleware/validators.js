"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validatePassword = exports.validateEmail = void 0;
const express_validator_1 = require("express-validator");
// Validator for email validation
exports.validateEmail = [
    (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email address"),
];
// Validator for password validation
exports.validatePassword = [
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long validator"),
];
// Middleware function to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
