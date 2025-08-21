// index.js

// Panggil 'dotenv' di baris paling atas!
require('dotenv').config(); 

const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(express.json());

// Konfigurasi koneksi sekarang membaca dari environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


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

// Endpoint untuk mendapatkan semua tasks (GET)
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi error di server');
  }
});

// Endpoint untuk menambahkan task baru (POST)
app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body; // Ambil 'title' dari body request

    // Validasi sederhana, pastikan title tidak kosong
    if (!title) {
      return res.status(400).json({ error: 'Title tidak boleh kosong' });
    }

    // Query untuk memasukkan data baru
    // `$1` adalah placeholder untuk keamanan (mencegah SQL Injection)
    const newTask = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
      [title]
    );

    // Kirim kembali data yang baru saja dibuat dengan status 201 Created
    res.status(201).json(newTask.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi error di server');
  }
});

// Endpoint untuk mengupdate task (PUT)
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params; // Ambil 'id' dari parameter URL
    const { title, is_completed } = req.body; // Ambil data baru dari body

    // Cek apakah data yang mau diupdate ada
    if (title === undefined || is_completed === undefined) {
      return res.status(400).json({ error: 'Title dan is_completed harus disertakan' });
    }

    const updatedTask = await pool.query(
      "UPDATE tasks SET title = $1, is_completed = $2 WHERE id = $3 RETURNING *",
      [title, is_completed, id]
    );

    // Kalau tidak ada baris yang ter-update (id tidak ditemukan)
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task tidak ditemukan' });
    }

    res.json(updatedTask.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi error di server');
  }
});

// Endpoint untuk menghapus task (DELETE)
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params; // Ambil 'id' dari parameter URL

    const deletedTask = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id]
    );
      
    // Kalau tidak ada baris yang terhapus (id tidak ditemukan)
    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ error: 'Task tidak ditemukan' });
    }

    // Kirim pesan sukses
    res.json({ message: 'Task berhasil dihapus', task: deletedTask.rows[0] });

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