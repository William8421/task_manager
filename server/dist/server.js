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
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:4200",
    "http://localhost:4200", // Always allow local dev
    "https://wm-task-manager.netlify.app", // Your deployed frontend
];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow request
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Required for authentication headers
    optionsSuccessStatus: 204,
};
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOptions));
// Define routes
app.use("/users", usersRouter_1.default);
app.use("/tasks", tasksRouter_1.default);
// Generic error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
