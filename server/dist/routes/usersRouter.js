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
const express_1 = __importDefault(require("express"));
const dbConnect_1 = require("../helper/dbConnect");
const userController_1 = require("../controllers/userController");
const validateToken_1 = require("../middleware/validateToken");
const validators_1 = require("../middleware/validators");
const router = express_1.default.Router();
// Define a route to fetch users from the database
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield dbConnect_1.pool.connect();
        const result = yield client.query("SELECT * FROM users");
        const users = result.rows;
        client.release(); // Release the client back to the pool
        res.json(users);
    }
    catch (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Internal Server Error");
    }
}));
/**
 * @route POST /users/signup
 * @desc signing up, and get access token
 * @access Public
 */
router.post("/signup", validators_1.validateEmail, validators_1.validatePassword, validators_1.handleValidationErrors, userController_1.registerUser);
/**
 * @route POST /users/signin
 * @desc signing in, and get access token
 * @access Public
 */
router.post("/signin", validators_1.validateEmail, validators_1.validatePassword, validators_1.handleValidationErrors, userController_1.signInUser);
/**
 * @route POST / users/userinfo
 * @desc get user profile
 * @access Private
 */
router.post("/profile", validateToken_1.validateToken, userController_1.userProfile);
/**
 * @route POST /users/update
 * @desc updating the user information
 * @access Private
 */
router.put("/profile/update", validateToken_1.validateToken, userController_1.updateUser);
/**
 * @route PUT /users/password/change
 * @desc change user password
 * @access Private
 */
router.put("/password/change", validateToken_1.validateToken, validators_1.validatePassword, validators_1.handleValidationErrors, userController_1.changePassword);
exports.default = router;
