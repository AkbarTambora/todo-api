// src/controllers/task.controller.js

const pool = require('../db');
const asyncHandler = require('express-async-handler'); 

// GET all tasks dengan PAGINATION
const getAllTasks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  const offset = (page - 1) * limit;

  const tasksResult = await pool.query(
    'SELECT * FROM tasks ORDER BY id ASC LIMIT $1 OFFSET $2',
    [limit, offset]
  );

  const totalResult = await pool.query('SELECT COUNT(*) FROM tasks');
  const totalTasks = parseInt(totalResult.rows[0].count);

  res.json({
    totalTasks: totalTasks,
    totalPages: Math.ceil(totalTasks / limit),
    currentPage: page,
    tasks: tasksResult.rows,
  });
});

// POST a new task
const createTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const newTask = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title]
  );
  res.status(201).json(newTask.rows[0]);
});

// UPDATE a task
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, is_completed } = req.body;
  const updatedTask = await pool.query(
    "UPDATE tasks SET title = $1, is_completed = $2 WHERE id = $3 RETURNING *",
    [title, is_completed, id]
  );

  if (updatedTask.rows.length === 0) {
    res.status(404); // Set status code
    throw new Error('Task tidak ditemukan');
  }
  res.json(updatedTask.rows[0]);
});

// DELETE a task
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedTask = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING *",
    [id]
  );

  if (deletedTask.rows.length === 0) {
    res.status(404);
    throw new Error('Task tidak ditemukan');
  }
  res.json({ message: 'Task berhasil dihapus', task: deletedTask.rows[0] });
});

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};