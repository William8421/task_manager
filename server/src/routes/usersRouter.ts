import express, { Request, Response } from "express";

import { pool } from "../helper/dbConnect";
import {
  changePassword,
  registerUser,
  signInUser,
  updateUser,
  userProfile,
} from "../controllers/userController";
import { validateToken } from "../middleware/validateToken";
import {
  handleValidationErrors,
  validateEmail,
  validatePassword,
} from "../middleware/validators";
const router = express.Router();

// Define a route to fetch users from the database
router.get("/", async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users");
    const users = result.rows;
    client.release(); // Release the client back to the pool
    res.json(users);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @route POST /users/signup
 * @desc signing up, and get access token
 * @access Public
 */
router.post(
  "/signup",
  validateEmail,
  validatePassword,
  handleValidationErrors,
  registerUser
);

/**
 * @route POST /users/signin
 * @desc signing in, and get access token
 * @access Public
 */
router.post(
  "/signin",
  validateEmail,
  validatePassword,
  handleValidationErrors,
  signInUser
);

/**
 * @route POST / users/userinfo
 * @desc get user profile
 * @access Private
 */
router.post("/profile", validateToken, userProfile);

/**
 * @route POST /users/update
 * @desc updating the user information
 * @access Private
 */
router.put("/profile/update", validateToken, updateUser);

/**
 * @route PUT /users/password/change
 * @desc change user password
 * @access Private
 */
router.put(
  "/password/change",
  validateToken,
  validatePassword,
  handleValidationErrors,
  changePassword
);

export default router;
