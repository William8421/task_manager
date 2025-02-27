"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTest = exports.getAllTests = void 0;
const dbConnect_1 = require("../../../dbConnect");
const response_1 = require("../helper/response");
const getAllTests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield dbConnect_1.pool.connect();
    try {
        const testQuery = yield client.query("SELECT * FROM tests");
        const myTests = testQuery.rows;
        (0, response_1.sendSuccessResponse)(res, 200, myTests);
    }
    catch (err) {
        console.error("Error fetching tasks:", err);
        (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.getAllTests = getAllTests;
const createTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { test_title, test_description } = req.body;
    try {
        // Check if the user exists
        // Insert the new task
        const newTestQuery = `
        INSERT INTO tests (test_title, test_description)
        VALUES ($1, $2)
        RETURNING *
      `;
        const newTest = yield dbConnect_1.pool.query(newTestQuery, [
            test_title,
            test_description,
        ]);
        const test = newTest.rows[0];
        return (0, response_1.sendSuccessResponse)(res, 201, { test, message: "Test created" });
    }
    catch (err) {
        console.error("Error creating task:", err);
        return (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.createTest = createTest;
