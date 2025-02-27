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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getAllTasks = exports.createTask = void 0;
const dbConnect_1 = require("../../../dbConnect");
const response_1 = require("../helper/response");
// Create a new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, title, description, due_date, status } = req.body;
    try {
        // Check if the user exists
        const userQuery = yield dbConnect_1.pool.query("SELECT * FROM users WHERE user_id = $1", [user_id]);
        const user = userQuery.rows[0];
        if (!user) {
            return (0, response_1.sendErrorResponse)(res, 404, "User not found");
        }
        // Insert the new task
        const newTaskQuery = `
      INSERT INTO tasks (title, description, due_date, user_id, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const newTask = yield dbConnect_1.pool.query(newTaskQuery, [
            title,
            description,
            due_date,
            user_id,
            status,
        ]);
        const task = newTask.rows[0];
        return (0, response_1.sendSuccessResponse)(res, 201, { task, message: "Task created" });
    }
    catch (err) {
        console.error("Error creating task:", err);
        return (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.createTask = createTask;
// Get all tasks
const getAllTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body;
    try {
        const allTasksQuery = yield dbConnect_1.pool.query("SELECT * FROM tasks WHERE user_id = $1", [user_id]);
        const myTasks = allTasksQuery.rows;
        (0, response_1.sendSuccessResponse)(res, 200, myTasks);
    }
    catch (err) {
        console.error("Error fetching tasks:", err);
        (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.getAllTasks = getAllTasks;
// Update task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { task_id, title, description, due_date, status, user_id } = req.body;
    try {
        const taskQuery = yield dbConnect_1.pool.query("SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2", [task_id, user_id]);
        const task = taskQuery.rows[0];
        if (!task) {
            return (0, response_1.sendErrorResponse)(res, 404, "Task not found or you don't have permission to update it!");
        }
        const updateQuery = `
      UPDATE tasks
      SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        due_date = COALESCE($4, due_date),
        status = COALESCE($5, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE task_id = $1
      RETURNING *
    `;
        const result = yield dbConnect_1.pool.query(updateQuery, [
            task_id,
            title || task.title,
            description || task.description,
            due_date || task.due_date,
            status || task.status,
        ]);
        const updatedTask = result.rows[0];
        (0, response_1.sendSuccessResponse)(res, 200, {
            updatedTask,
            message: "Task updated successfully",
        });
    }
    catch (err) {
        console.error("Error updating task:", err);
        (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.updateTask = updateTask;
// Delete task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, task_id } = req.body;
    try {
        const taskQuery = yield dbConnect_1.pool.query("SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2", [task_id, user_id]);
        const task = taskQuery.rows[0];
        if (!task) {
            return (0, response_1.sendErrorResponse)(res, 404, "Task not found or you don't have permission to delete it");
        }
        yield dbConnect_1.pool.query("DELETE FROM tasks WHERE task_id = $1", [task_id]);
        (0, response_1.sendSuccessResponse)(res, 200, "Task deleted successfully");
    }
    catch (err) {
        console.error("Error deleting task:", err);
        (0, response_1.sendErrorResponse)(res, 500, "Internal Server Error");
    }
});
exports.deleteTask = deleteTask;
