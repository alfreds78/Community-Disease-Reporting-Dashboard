const pool = require("../config/db");

// Get all users
exports.getUsers = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Create new user
exports.createUser = async (req, res, next) => {
  try {
    const { email, password_hash } = req.body;
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, password_hash]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password_hash } = req.body;
    const result = await pool.query(
      "UPDATE users SET email=$1, password_hash=$2 WHERE id=$3 RETURNING id, email, created_at",
      [email, password_hash, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};