"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const usersRouter_1 = __importDefault(require("./routes/usersRouter"));
const tasksRouter_1 = __importDefault(require("./routes/tasksRouter"));
// Load environment variables from .env file
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Check if required environment variables
if (!process.env.PORT) {
    console.error("Please define PORT in your .env file");
    process.exit(1);
}
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Define routes
app.use("/users", usersRouter_1.default);
app.use("/tasks", tasksRouter_1.default);
// Generic error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});
app.get("/test", (req, res) => {
    res.send("Server is running!");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`Database: ${process.env.PG_DATABASE}`);
});
