const body = document.body;
const darkToggleBtn = document.querySelector('.dark-toggle');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoDate = document.getElementById('todo-date');
const todoComment = document.getElementById('todo-comment');
const todoList = document.getElementById('todo-list');


if(localStorage.getItem('darkMode') === 'enabled'){
  body.classList.add('dark');
  darkToggleBtn.textContent = '☀️ Light Mode';
}

darkToggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  if(body.classList.contains('dark')){
    darkToggleBtn.textContent = '☀️ Light Mode';
    localStorage.setItem('darkMode', 'enabled');
  } else {
    darkToggleBtn.textContent = '🌙 Dark Mode';
    localStorage.setItem('darkMode', 'disabled');
  }
});


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const dateObj = new Date(dateStr + 'T00:00:00');
  return dateObj.toLocaleDateString(undefined, options);
}

function renderTasks() {
  todoList.innerHTML = '';

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';

    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';

    
    const spanText = document.createElement('span');
    spanText.className = 'task-text';
    spanText.textContent = task.text;
    spanText.title = "Click to toggle complete, double-click to edit";

    
    spanText.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    
    spanText.addEventListener('dblclick', () => {
      spanText.contentEditable = true;
      spanText.focus();
    });

    
    spanText.addEventListener('blur', () => {
      spanText.contentEditable = false;
      const newText = spanText.textContent.trim();
      if(newText === '') {
        tasks.splice(index, 1);
      } else {
        tasks[index].text = newText;
      }
      saveTasks();
      renderTasks();
    });

    spanText.addEventListener('keydown', e => {
      if(e.key === 'Enter') {
        e.preventDefault();
        spanText.blur();
      }
    });

    
    const spanComment = document.createElement('span');
    spanComment.className = 'task-comment';
    spanComment.textContent = task.comment || '';
    spanComment.title = "Double-click to edit comment";

    
    spanComment.addEventListener('dblclick', () => {
      spanComment.contentEditable = true;
      spanComment.focus();
    });

    
    spanComment.addEventListener('blur', () => {
      spanComment.contentEditable = false;
      tasks[index].comment = spanComment.textContent.trim();
      saveTasks();
      renderTasks();
    });

    spanComment.addEventListener('keydown', e => {
      if(e.key === 'Enter') {
        e.preventDefault();
        spanComment.blur();
      }
    });

    
    const dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'due-date';
    dueDateSpan.textContent = task.dueDate ? formatDate(task.dueDate) : '';
    dueDateSpan.title = task.dueDate ? `Due date: ${formatDate(task.dueDate)}` : '';

    
    const buttons = document.createElement('div');
    buttons.className = 'buttons';

    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Delete task';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    buttons.appendChild(deleteBtn);

    taskContent.appendChild(spanText);
    taskContent.appendChild(spanComment);

    li.appendChild(taskContent);
    if(task.dueDate) li.appendChild(dueDateSpan);
    li.appendChild(buttons);

    todoList.appendChild(li);
  });
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const text = todoInput.value.trim();
  if(!text) return;

  const dueDate = todoDate.value;
  const comment = todoComment.value.trim();

  tasks.push({ text, dueDate, comment, completed: false });
  saveTasks();
  renderTasks();

  todoInput.value = '';
  todoDate.value = '';
  todoComment.value = '';
  todoInput.focus();
});

renderTasks();
