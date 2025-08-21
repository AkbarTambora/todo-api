// index.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./src/routes/task.routes');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(express.static('public'));

app.use('/api/tasks', taskRoutes);

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});