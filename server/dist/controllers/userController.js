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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateUser = exports.userProfile = exports.signInUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const gernerateToken_1 = require("../helper/gernerateToken");
const dbConnect_1 = require("../helper/dbConnect");
const validators_1 = require("../middleware/validators");
const response_1 = require("../helper/response");
// User registration
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract user data from request body
    const { username, email, password, first_name, last_name, profile_picture } = req.body;
    try {
        // Hash the password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Check if username or email already exists
        const client = yield dbConnect_1.pool.connect();
        const usernameQuery = yield client.query("SELECT * FROM users WHERE username = $1", [username]);
        const emailQuery = yield client.query("SELECT * FROM users WHERE email = $1", [email]);
        if (usernameQuery.rows.length > 0) {
            return (0, response_1.sendErrorResponse)(res, 400, "Username already exists");
        }
        if (emailQuery.rows.length > 0) {
            return (0, response_1.sendErrorResponse)(res, 400, "Email already exists");
        }
        // Insert new user into database
        const insertQuery = `
      INSERT INTO users (username, email, password, first_name, last_name, profile_picture)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const newUser = yield client.query(insertQuery, [
            username,
            email,
            hashedPassword,
            first_name,
            last_name,
            profile_picture || null,
        ]);
        const user = newUser.rows[0];
        // Generate token
        const token = (0, gernerateToken_1.generateToken)({
            user_id: user.user_id,
            username: user.username,
        });
        client.release();
        return (0, response_1.sendSuccessResponse)(res, 201, { token, user });
    }
    catch (err) {
        console.error("Error executing query:", err);
        return (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.registerUser = registerUser;
// User login
const signInUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if the user exists based on email
        const client = yield dbConnect_1.pool.connect();
        const query = "SELECT * FROM users WHERE email = $1";
        const result = yield client.query(query, [email]);
        const user = result.rows[0];
        if (!user) {
            return (0, response_1.sendErrorResponse)(res, 401, "Either email or password is incorrect!");
        }
        // Verify the password
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return (0, response_1.sendErrorResponse)(res, 401, "Either email or password is incorrect!");
        }
        // Password is correct, generate token
        const token = (0, gernerateToken_1.generateToken)({
            user_id: user.user_id,
            username: user.username,
        });
        // Return token and user data
        return (0, response_1.sendSuccessResponse)(res, 200, { token, user });
    }
    catch (err) {
        console.error("Error executing query:", err);
        return (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.signInUser = signInUser;
// Retrieve user profile
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body;
    if (!user_id) {
        return (0, response_1.sendErrorResponse)(res, 400, "User ID is missing");
    }
    try {
        const client = yield dbConnect_1.pool.connect();
        const userQuery = yield client.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        const user = userQuery.rows[0];
        if (!user) {
            return (0, response_1.sendErrorResponse)(res, 404, "User not found");
        }
        client.release();
        return (0, response_1.sendSuccessResponse)(res, 200, { user });
    }
    catch (err) {
        console.error("Error fetching user:", err);
        return (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.userProfile = userProfile;
// Update user information
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, username, first_name, last_name, profile_picture } = req.body;
    try {
        const client = yield dbConnect_1.pool.connect();
        const userQuery = yield client.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        const user = userQuery.rows[0];
        if (!user) {
            return (0, response_1.sendErrorResponse)(res, 404, "User not found");
        }
        // Check if the username is being changed and if it exists for another user
        if (username && username !== user.username) {
            const usernameQuery = yield client.query("SELECT * FROM users WHERE username = $1 AND user_id != $2", [username, user_id]);
            const existedUsername = usernameQuery.rows[0];
            if (existedUsername) {
                return (0, response_1.sendErrorResponse)(res, 401, "Username already exists. Please try another username.");
            }
        }
        // Update user information
        const updateQuery = `
      UPDATE users
      SET username = COALESCE($2, username),
      first_name = COALESCE($3, first_name),
      last_name = COALESCE($4, last_name),
      profile_picture = COALESCE($5, profile_picture)
    WHERE user_id = $1
    RETURNING *
    `;
        const result = yield dbConnect_1.pool.query(updateQuery, [
            user_id,
            username || user.username,
            first_name || user.first_name,
            last_name || user.last_name,
            profile_picture || user.profile_picture,
        ]);
        const updatedUser = result.rows[0];
        return (0, response_1.sendSuccessResponse)(res, 200, {
            updatedUser,
            message: "Profile updated successfully",
        });
    }
    catch (err) {
        console.error("Error updating user:", err);
        return (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.updateUser = updateUser;
// Change user password
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, oldPassword, password } = req.body;
    try {
        // Validate the new password
        yield Promise.all(validators_1.validatePassword.map((validator) => validator.run(req)));
        // Retrieve the user's current password from the database
        const client = yield dbConnect_1.pool.connect();
        const userQuery = yield client.query("SELECT password FROM users WHERE user_id = $1", [user_id]);
        const user = userQuery.rows[0];
        client.release();
        if (!user) {
            return (0, response_1.sendErrorResponse)(res, 404, "User not found");
        }
        if (password === oldPassword) {
            return (0, response_1.sendErrorResponse)(res, 401, "You can't use the same password");
        }
        // Verify the current password
        const passwordMatch = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return (0, response_1.sendErrorResponse)(res, 401, "Incorrect password");
        }
        // Hash the new password
        const hashedNewPassword = yield bcrypt_1.default.hash(password, 10);
        // Update the user's password in the database
        yield dbConnect_1.pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [
            hashedNewPassword,
            user_id,
        ]);
        return (0, response_1.sendSuccessResponse)(res, 200, "Password changed successfully");
    }
    catch (err) {
        console.error("Error changing password:", err);
        return (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.changePassword = changePassword;
