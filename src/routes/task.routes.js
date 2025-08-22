// src/routes/task.routes.js

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); 

// Impor para 'Manajer' dari controller
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

// Aturan Validasi
const createTaskValidationRules = [
  body('title')
    .notEmpty().withMessage('Title tidak boleh kosong')
    .isString().withMessage('Title harus berupa teks')
    .isLength({ min: 3 }).withMessage('Title minimal harus 3 karakter'),
];

const updateTaskValidationRules = [
  body('title')
    .notEmpty().withMessage('Title tidak boleh kosong')
    .isString().withMessage('Title harus berupa teks')
    .isLength({ min: 3 }).withMessage('Title minimal harus 3 karakter'),
  body('is_completed')
    .isBoolean().withMessage('is_completed harus berupa boolean (true/false)'),
];

// Fungsi Middleware untuk Menangani Error Validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // Jika tidak ada error, lanjutkan ke controller
  }
  // Jika ada error, kirim respons 400 dengan daftar error
  return res.status(400).json({ errors: errors.array() });
};

// Terapkan Aturan ke Rute
router.get('/', getAllTasks);
router.post('/', createTaskValidationRules, validate, createTask); 
router.put('/:id', updateTaskValidationRules, validate, updateTask); 
router.delete('/:id', deleteTask);

module.exports = router;