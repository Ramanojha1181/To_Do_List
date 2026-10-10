        const taskInput = document.getElementById('taskInput');
        const taskList = document.getElementById('taskList');

        // Load tasks from LocalStorage on startup
        let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        renderTasks();

        // Listen for Enter keypress
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });

        function addTask() {
            const taskText = taskInput.value.trim();
            if (taskText === '') return;

            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };

            savedTasks.push(newTask);
            saveAndRender();
            taskInput.value = '';
        }

        function toggleTask(id) {
            savedTasks = savedTasks.map(task => 
                task.id === id ? { ...task, completed: !task.completed } : task
            );
            saveAndRender();
        }

        function deleteTask(id) {
            savedTasks = savedTasks.filter(task => task.id !== id);
            saveAndRender();
        }

        function saveAndRender() {
            localStorage.setItem('tasks', JSON.stringify(savedTasks));
            renderTasks();
        }

        function renderTasks() {
            taskList.innerHTML = '';
            savedTasks.forEach(task => {
                const li = document.createElement('li');
                if (task.completed) li.classList.add('completed');

                li.innerHTML = `
                    <span class="task-text" onclick="toggleTask(${task.id})">${escapeHtml(task.text)}</span>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                `;
                taskList.appendChild(li);
            });
        }

        // Helper to prevent XSS injection
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.innerText = text;
            return div.innerHTML;
        }