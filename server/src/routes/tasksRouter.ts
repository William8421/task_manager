import express from "express";

import {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  searchTasksByTitle,
  filterByStatus,
  filterByPriority,
  filterByStatusAndPriority,
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
 * @route Post /tasks/status/filter
 * @desc get a list of tasks filtered by status
 * @access Private
 */
router.post("/status/filter", validateToken, filterByStatus);

/**
 * @route Post /tasks/priority/filter
 * @desc get a list of tasks filtered by priority
 * @access Private
 */
router.post("/priority/filter", validateToken, filterByPriority);

/**
 * @route Post /tasks/status and priority/filter
 * @desc get a list of tasks filtered by status and priority
 * @access Private
 */
router.post(
  "/status&priority/filter",
  validateToken,
  filterByStatusAndPriority
);

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
