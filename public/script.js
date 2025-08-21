// public/script.js

// Alamat base API kita
const API_URL = 'http://localhost:8000/api/tasks';

// Mengambil elemen-elemen dari HTML
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

// --- FUNGSI UTAMA: Mengambil dan Menampilkan Semua Tasks ---
const fetchTasks = async () => {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();

        // Kosongkan daftar task sebelum diisi ulang
        taskList.innerHTML = '';

        // Loop setiap task dan buat elemen HTML-nya
        tasks.forEach(task => {
            const item = document.createElement('li');
            item.className = 'task-item';
            
            const title = document.createElement('span');
            title.textContent = task.title;
            if (task.is_completed) {
                title.className = 'completed';
            }

            const actions = document.createElement('div');
            actions.className = 'actions';

            // Tombol Selesai/Batal
            const completeButton = document.createElement('button');
            completeButton.className = 'btn-complete';
            completeButton.textContent = task.is_completed ? 'Batal' : 'Selesai';
            completeButton.onclick = () => toggleComplete(task);
            
            // Tombol Hapus
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-delete';
            deleteButton.textContent = 'Hapus';
            deleteButton.onclick = () => deleteTask(task.id);

            actions.appendChild(completeButton);
            actions.appendChild(deleteButton);
            
            item.appendChild(title);
            item.appendChild(actions);
            
            taskList.appendChild(item);
        });
    } catch (error) {
        console.error('Gagal mengambil tasks:', error);
    }
};

// --- FUNGSI: Menambah Task Baru ---
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah form reload halaman
    
    const title = taskInput.value;
    if (!title) return;

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        taskInput.value = ''; // Kosongkan input
        fetchTasks(); // Refresh daftar task
    } catch (error) {
        console.error('Gagal menambah task:', error);
    }
});

// --- FUNGSI: Mengubah Status Selesai (UPDATE) ---
const toggleComplete = async (task) => {
    try {
        await fetch(`${API_URL}/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: task.title,
                is_completed: !task.is_completed // Balikkan statusnya
            })
        });
        fetchTasks(); // Refresh daftar task
    } catch (error) {
        console.error('Gagal mengupdate task:', error);
    }
};

// --- FUNGSI: Menghapus Task (DELETE) ---
const deleteTask = async (id) => {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        fetchTasks(); // Refresh daftar task
    } catch (error) {
        console.error('Gagal menghapus task:', error);
    }
};


// --- Jalankan fungsi fetchTasks saat halaman pertama kali dimuat ---
fetchTasks();