// src/controllers/task.controller.js

const pool = require('../db'); 

// Manajer untuk GET all tasks
const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi error di server');
  }
};

// Manajer untuk POST a new task
const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title tidak boleh kosong' });
    }
    const newTask = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi error di server');
  }
};

// Manajer untuk UPDATE a task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, is_completed } = req.body;
    if (title === undefined || is_completed === undefined) {
      return res.status(400).json({ error: 'Title dan is_completed harus disertakan' });
    }
    const updatedTask = await pool.query(
      "UPDATE tasks SET title = $1, is_completed = $2 WHERE id = $3 RETURNING *",
      [title, is_completed, id]
    );
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task tidak ditemukan' });
    }
    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi error di server');
  }
};

// Manajer untuk DELETE a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );
    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task tidak ditemukan' });
    }
    res.json({ message: 'Task berhasil dihapus', task: deletedTask.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi error di server');
  }
};

// 'Ekspor' semua manajer agar bisa dipakai di tempat lain
module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};