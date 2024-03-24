import express from "express";

import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { validateToken } from "../middleware/validateToken";

const router = express.Router();

/**
 * @route POST /tasks/create
 * @desc create a task
 * @access Private
 */
router.post("/create", validateToken, createTask);

/**
 * @route Post /tasks/alltasks
 * @desc get a list of user all tasks
 * @access Private
 */
router.post("/alltasks", validateToken, getAllTasks);

/**
 * @route PUT /tasks/update
 * @desc update a task
 * @access Private
 */
router.put("/task/update", validateToken, updateTask);

/**
 * @route DELETE /tasks/delete
 * @desc delete a task
 * @access Private
 */
router.delete("/delete", validateToken, deleteTask);

export default router;
