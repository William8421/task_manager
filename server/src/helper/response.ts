import { Response } from "express";

// Helper function to send success response
export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  data: any
) => {
  return res.status(statusCode).json(data);
};

// Helper function to send error response
export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string
) => {
  return res.status(statusCode).send(message);
};
