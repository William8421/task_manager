import express from "express";

import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getFilteredTasks,
  searchTasksByTitle,
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
 * @route Post /tasks/completed
 * @desc get a list of user filtered tasks
 * @access Private
 */
router.post("/completed", validateToken, getFilteredTasks);

/**
 * @route Post /tasks/search
 * @desc get a list of user tasks searched by title
 * @access Private
 */
router.post("/search", validateToken, searchTasksByTitle);

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
