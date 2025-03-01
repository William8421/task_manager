import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/usersRouter";
import taskRouter from "./routes/tasksRouter";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check if required environment variables
if (!process.env.PORT) {
  console.error("Please define PORT in your .env file");
  process.exit(1);
}

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Define routes
app.use("/users", usersRouter);
app.use("/tasks", taskRouter);

// Generic error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
