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

// export const validatePassword = [
//   body("password")
//     .isLength({ min: 6 })
//     .withMessage("Password must be at least 6 characters long")
//     .matches(/\d/)
//     .withMessage("Password must contain at least one number")
//     .matches(/[a-z]/)
//     .withMessage("Password must contain at least one lowercase letter")
//     .matches(/[A-Z]/)
//     .withMessage("Password must contain at least one uppercase letter")
//     .matches(/[!@#$%^&*(),.?":{}|<>]/)
//     .withMessage("Password must contain at least one special character"),
// ];

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
