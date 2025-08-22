// public/script.js

const API_URL = 'http://localhost:8000/api/tasks';

// State halaman saat ini dan limit per halaman
let currentPage = 1;
const LIMIT_PER_PAGE = 5; 

// Mengambil elemen-elemen dari HTML
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const paginationControls = document.getElementById('pagination-controls');

// Get tasks dengan pagination
const fetchTasks = async (page) => {
    try {
        taskList.innerHTML = '<li class="task-item">Loading...</li>';
        paginationControls.innerHTML = ''; 

        const response = await fetch(`${API_URL}?page=${page}&limit=${LIMIT_PER_PAGE}`);
        const data = await response.json(); 

        taskList.innerHTML = '';

        if (data.tasks.length === 0 && currentPage > 1) {
            currentPage--;
            fetchTasks(currentPage);
            return;
        }

        data.tasks.forEach(task => {
            const item = document.createElement('li');
            item.className = 'task-item';
            const title = document.createElement('span');
            title.textContent = task.title;
            if (task.is_completed) { title.className = 'completed'; }
            const actions = document.createElement('div');
            actions.className = 'actions';
            const completeButton = document.createElement('button');
            completeButton.className = 'btn-complete';
            completeButton.textContent = task.is_completed ? 'Batal' : 'Selesai';
            completeButton.onclick = () => toggleComplete(task);
            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn-delete';
            deleteButton.textContent = 'Hapus';
            deleteButton.onclick = () => deleteTask(task.id, data.tasks.length); 
            actions.appendChild(completeButton);
            actions.appendChild(deleteButton);
            item.appendChild(title);
            item.appendChild(actions);
            taskList.appendChild(item);
        });

        renderPagination(data.totalPages, data.currentPage);

    } catch (error) {
        console.error('Gagal mengambil tasks:', error);
        taskList.innerHTML = '<li class="task-item">Gagal memuat data. Coba lagi nanti.</li>';
    }
};


// Render Tombol Pagination
const renderPagination = (totalPages, page) => {
    paginationControls.innerHTML = `
        <button id="prev-btn" ${page <= 1 ? 'disabled' : ''}>Previous</button>
        <span>Halaman ${page} dari ${totalPages}</span>
        <button id="next-btn" ${page >= totalPages ? 'disabled' : ''}>Next</button>
    `;

    // Event listener
    document.getElementById('prev-btn')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchTasks(currentPage);
        }
    });

    document.getElementById('next-btn')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchTasks(currentPage);
        }
    });
};

// Add Task
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskInput.value;
    if (!title) return;
    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        taskInput.value = '';
        fetchTasks(currentPage); 
    } catch (error) {
        console.error('Gagal menambah task:', error);
    }
});

// Delete Task
const deleteTask = async (id, tasksOnPage) => {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (tasksOnPage === 1 && currentPage > 1) {
            currentPage--;
        }
        fetchTasks(currentPage);
    } catch (error) {
        console.error('Gagal menghapus task:', error);
    }
};

const toggleComplete = async (task) => {
    try {
        await fetch(`${API_URL}/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: task.title,
                is_completed: !task.is_completed
            })
        });
        fetchTasks(currentPage); 
    } catch (error) {
        console.error('Gagal mengupdate task:', error);
    }
};

fetchTasks(currentPage);