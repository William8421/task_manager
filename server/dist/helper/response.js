"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
// Helper function to send success response
const sendSuccessResponse = (res, statusCode, data) => {
    return res.status(statusCode).json(data);
};
exports.sendSuccessResponse = sendSuccessResponse;
// Helper function to send error response
const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).send(message);
};
exports.sendErrorResponse = sendErrorResponse;
