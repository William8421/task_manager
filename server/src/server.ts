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

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:4200",
  "http://localhost:4200",
  "https://wm-task-manager.netlify.app",
];

const corsOptions: cors.CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
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
