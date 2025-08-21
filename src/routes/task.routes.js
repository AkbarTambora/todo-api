// src/routes/task.routes.js

const express = require('express');
const router = express.Router();

// Impor para 'Manajer' dari controller
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

// Jika ada request GET ke '/', panggil manajer getAllTasks
router.get('/', getAllTasks);

// Jika ada request POST ke '/', panggil manajer createTask
router.post('/', createTask);

// Jika ada request PUT ke '/:id', panggil manajer updateTask
router.put('/:id', updateTask);

// Jika ada request DELETE ke '/:id', panggil manajer deleteTask
router.delete('/:id', deleteTask);

module.exports = router;