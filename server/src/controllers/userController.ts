import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../helper/gernerateToken";
import { pool } from "../helper/dbConnect";
import { validatePassword } from "../middleware/validators";
import { sendErrorResponse, sendSuccessResponse } from "../helper/response";

// User registration
export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, first_name, last_name, profile_picture } =
    req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    const usernameQuery = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const emailQuery = await client.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (usernameQuery.rows.length > 0) {
      return sendErrorResponse(res, 400, "Username already exists");
    }

    if (emailQuery.rows.length > 0) {
      return sendErrorResponse(res, 400, "Email already exists");
    }

    const insertQuery = `
      INSERT INTO users (username, email, password, first_name, last_name, profile_picture)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const newUser = await client.query(insertQuery, [
      username,
      email,
      hashedPassword,
      first_name,
      last_name,
      profile_picture || null,
    ]);
    const user = newUser.rows[0];

    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
    });

    client.release();

    return sendSuccessResponse(res, 201, { token, user });
  } catch (err) {
    console.error("Error executing query:", err);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// User login
export const signInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const client = await pool.connect();
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await client.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      return sendErrorResponse(
        res,
        401,
        "Either email or password is incorrect!"
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return sendErrorResponse(
        res,
        401,
        "Either email or password is incorrect!"
      );
    }

    const token = generateToken({
      user_id: user.user_id,
      username: user.username,
    });

    return sendSuccessResponse(res, 200, { token, user });
  } catch (err) {
    console.error("Error executing query:", err);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Retrieve user profile
export const userProfile = async (req: Request, res: Response) => {
  const { user_id } = req.body;

  if (!user_id) {
    return sendErrorResponse(res, 400, "User ID is missing");
  }

  try {
    const client = await pool.connect();
    const userQuery = await client.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    const user = userQuery.rows[0];

    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    client.release();
    return sendSuccessResponse(res, 200, { user });
  } catch (err) {
    console.error("Error fetching user:", err);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Update user information
export const updateUser = async (req: Request, res: Response) => {
  const { user_id, username, first_name, last_name, profile_picture } =
    req.body;

  try {
    const client = await pool.connect();
    const userQuery = await client.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id]
    );
    const user = userQuery.rows[0];

    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    if (username && username !== user.username) {
      const usernameQuery = await client.query(
        "SELECT * FROM users WHERE username = $1 AND user_id != $2",
        [username, user_id]
      );
      const existedUsername = usernameQuery.rows[0];

      if (existedUsername) {
        return sendErrorResponse(
          res,
          401,
          "Username already exists. Please try another username."
        );
      }
    }
    const newProfilePicture = profile_picture === "" ? null : profile_picture;

    const updateQuery = `
      UPDATE users
      SET username = COALESCE($2, username),
      first_name = COALESCE($3, first_name),
      last_name = COALESCE($4, last_name),
      profile_picture = COALESCE($5, profile_picture)
    WHERE user_id = $1
    RETURNING *
    `;

    const result = await pool.query(updateQuery, [
      user_id,
      username || user.username,
      first_name || user.first_name,
      last_name || user.last_name,
      profile_picture,
    ]);
    const updatedUser = result.rows[0];

    return sendSuccessResponse(res, 200, {
      updatedUser,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Change user password
export const changePassword = async (req: Request, res: Response) => {
  const { user_id, oldPassword, password } = req.body;

  try {
    await Promise.all(validatePassword.map((validator) => validator.run(req)));

    const client = await pool.connect();
    const userQuery = await client.query(
      "SELECT password FROM users WHERE user_id = $1",
      [user_id]
    );
    const user = userQuery.rows[0];
    client.release();

    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }

    if (password === oldPassword) {
      return sendErrorResponse(res, 401, "You can't use the same password");
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return sendErrorResponse(res, 401, "Incorrect password");
    }

    const hashedNewPassword = await bcrypt.hash(password, 10);

    await pool.query("UPDATE users SET password = $1 WHERE user_id = $2", [
      hashedNewPassword,
      user_id,
    ]);

    return sendSuccessResponse(res, 200, "Password changed successfully");
  } catch (err) {
    console.error("Error changing password:", err);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};
