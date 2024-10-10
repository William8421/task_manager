import { Request, Response } from "express";
import { pool } from "../helper/dbConnect";
import { sendErrorResponse, sendSuccessResponse } from "../helper/response";

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  const { user_id, title, description, due_date, status, priority } = req.body;

  try {
    // Check if the user exists
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    const user = userQuery.rows[0];
    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    // Insert the new task
    const newTaskQuery = `
      INSERT INTO tasks (title, description, due_date, user_id, status, priority)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const newTask = await pool.query(newTaskQuery, [
      title,
      description,
      due_date,
      user_id,
      status,
      priority,
    ]);
    const task = newTask.rows[0];

    return sendSuccessResponse(res, 201, { task, message: "Task created" });
  } catch (err) {
    console.error("Error creating task:", err);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Get all tasks
export const getAllTasks = async (req: Request, res: Response) => {
  const { user_id } = req.body;
  try {
    const allTasksQuery = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1",
      [user_id]
    );
    const myTasks = allTasksQuery.rows;
    sendSuccessResponse(res, 200, myTasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Get filtered tasks by status
export const filterByStatus = async (req: Request, res: Response) => {
  const { user_id, filter } = req.body;
  try {
    const filteredTasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 AND status = $2",
      [user_id, filter]
    );
    const tasks = filteredTasks.rows;

    sendSuccessResponse(res, 200, tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Get filtered tasks by priority
export const filterByPriority = async (req: Request, res: Response) => {
  const { user_id, filter } = req.body;

  try {
    const filteredTasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 AND priority = $2",
      [user_id, filter]
    );
    const tasks = filteredTasks.rows;

    sendSuccessResponse(res, 200, tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Get filtered tasks by both status and priority
export const filterByStatusAndPriority = async (
  req: Request,
  res: Response
) => {
  const { user_id, statusFilter, priorityFilter } = req.body;

  try {
    const filteredTasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 AND status = $2 AND priority = $3",
      [user_id, statusFilter, priorityFilter]
    );
    const tasks = filteredTasks.rows;
    sendSuccessResponse(res, 200, tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// search tasks by title
export const searchTasksByTitle = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  // Check if title is provided
  if (!title) {
    return sendErrorResponse(res, 400, "Title is required");
  }

  try {
    // Use parameterized query to prevent SQL injection
    const tasksQuery = await pool.query(
      `SELECT * FROM tasks WHERE user_id = $1 AND title ILIKE $2`,
      [user_id, `%${title}%`]
    );

    if (tasksQuery.rows.length === 0) {
      return sendErrorResponse(res, 404, "No tasks found");
    }

    const foundTasks = tasksQuery.rows;
    return sendSuccessResponse(res, 200, foundTasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Update task
export const updateTask = async (req: Request, res: Response) => {
  const { task_id, title, description, due_date, status, priority, user_id } =
    req.body;

  try {
    const taskQuery = await pool.query(
      "SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2",
      [task_id, user_id]
    );
    const task = taskQuery.rows[0];
    if (!task) {
      return sendErrorResponse(
        res,
        404,
        "Task not found or you don't have permission to update it!"
      );
    }

    const updateQuery = `
      UPDATE tasks
      SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        due_date = COALESCE($4, due_date),
        status = COALESCE($5, status),
        priority = COALESCE($6, priority),
        updated_at = CURRENT_TIMESTAMP
      WHERE task_id = $1
      RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      task_id,
      title || task.title,
      description || task.description,
      due_date || task.due_date,
      status || task.status,
      priority || task.priority,
    ]);
    const updatedTask = result.rows[0];
    sendSuccessResponse(res, 200, {
      updatedTask,
      message: "Task updated successfully",
    });
  } catch (err) {
    console.error("Error updating task:", err);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response) => {
  const { user_id, task_id } = req.body;

  try {
    const taskQuery = await pool.query(
      "SELECT * FROM tasks WHERE task_id = $1 AND user_id = $2",
      [task_id, user_id]
    );
    const task = taskQuery.rows[0];
    if (!task) {
      return sendErrorResponse(
        res,
        404,
        "Task not found or you don't have permission to delete it"
      );
    }

    await pool.query("DELETE FROM tasks WHERE task_id = $1", [task_id]);
    sendSuccessResponse(res, 200, { message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    sendErrorResponse(res, 500, "Internal Server Error");
  }
};
