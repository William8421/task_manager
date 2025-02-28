"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST || "localhost",
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT || "6543"),
    ssl: {
        rejectUnauthorized: false,
    },
});
exports.pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.error("Error executing query", err);
    }
    else {
        console.log("Query result", res.rows);
    }
});
