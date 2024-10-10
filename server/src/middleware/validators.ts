import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

// Validator for email validation
export const validateEmail = [
  body("email").isEmail().withMessage("Invalid email address"),
];

// Validator for password validation
export const validatePassword = [
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long validator"),
];

// Middleware function to handle validation errors
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
