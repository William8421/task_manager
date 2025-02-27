"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const validateToken_1 = require("../middleware/validateToken");
const router = express_1.default.Router();
/**
 * @route POST /tasks/create
 * @desc create a task
 * @access Private
 */
router.post("/create", validateToken_1.validateToken, taskController_1.createTask);
/**
 * @route Post /tasks/alltasks
 * @desc get a list of user all tasks
 * @access Private
 */
router.post("/alltasks", validateToken_1.validateToken, taskController_1.getAllTasks);
/**
 * @route PUT /tasks/update
 * @desc update a task
 * @access Private
 */
router.put("/task/update", validateToken_1.validateToken, taskController_1.updateTask);
/**
 * @route DELETE /tasks/delete
 * @desc delete a task
 * @access Private
 */
router.delete("/delete", validateToken_1.validateToken, taskController_1.deleteTask);
exports.default = router;
