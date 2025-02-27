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
 * @route Post /tasks/status/filter
 * @desc get a list of tasks filtered by status
 * @access Private
 */
router.post("/status/filter", validateToken_1.validateToken, taskController_1.filterByStatus);
/**
 * @route Post /tasks/priority/filter
 * @desc get a list of tasks filtered by priority
 * @access Private
 */
router.post("/priority/filter", validateToken_1.validateToken, taskController_1.filterByPriority);
/**
 * @route Post /tasks/status and priority/filter
 * @desc get a list of tasks filtered by status and priority
 * @access Private
 */
router.post("/status&priority/filter", validateToken_1.validateToken, taskController_1.filterByStatusAndPriority);
/**
 * @route Post /tasks/search
 * @desc get a list of user tasks searched by title
 * @access Private
 */
router.post("/search", validateToken_1.validateToken, taskController_1.searchTasksByTitle);
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
