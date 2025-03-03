import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// interface that extends the existing Request interface
interface AuthenticatedRequest extends Request {
  user?: { [key: string]: any } | JwtPayload | undefined;
}

// Middleware function to validate JWT token
export const validateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Get token from request header
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded: JwtPayload | string = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    );

    req.user = typeof decoded === "string" ? JSON.parse(decoded) : decoded;

    next();
  } catch (error) {
    console.error("Token validation error:", error);
    return res.status(401).send("Invalid token.");
  }
};
