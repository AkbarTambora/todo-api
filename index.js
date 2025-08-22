// index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./src/routes/task.routes');
const pool = require('./src/db'); 

const app = express();
const port = 3000;

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.static('public'));

app.use('/api/tasks', taskRoutes);

// Fungsi untuk inisialisasi database (membuat tabel jika belum ada)
const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE
      );
    `);
    console.log("Database siap: Tabel 'tasks' sudah ada atau berhasil dibuat.");
  } catch (err) {
    console.error("Gagal inisialisasi database:", err);
    process.exit(1); 
  }
};

// Global error handler

const errorHandler = (err, req, res, next) => {
  console.error("error: ", err.stack);
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

app.use(errorHandler);

const startServer = async () => {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });
};

startServer(); 