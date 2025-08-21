// index.js

// Panggil 'dotenv' di baris paling atas!
require('dotenv').config(); 

const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Konfigurasi koneksi sekarang membaca dari environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// ... sisa kodenya sama persis seperti sebelumnya ...

// Fungsi untuk inisialisasi database (membuat tabel jika belum ada)
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE
      );
    `);
    console.log("Tabel 'tasks' siap digunakan.");
  } catch (err) {
    console.error("Gagal inisialisasi database:", err);
  }
}

// Endpoint untuk mendapatkan semua tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi error di server');
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
  initializeDatabase();
});