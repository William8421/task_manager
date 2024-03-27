import jwt from "jsonwebtoken";

import { TokenPayloadProps } from "../types/types";

const secretKey = process.env.JWT_SECRET || "default_secret";

export function generateToken(payload: TokenPayloadProps): string {
  return jwt.sign(payload, secretKey, { expiresIn: "24h" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}
