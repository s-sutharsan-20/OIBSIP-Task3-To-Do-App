const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const pendingTodoListUL = document.getElementById('pending-todo-list');
const completedTodoListUL = document.getElementById('completed-todo-list');

let allTodos = getTodos();
updateTodoLists();

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    addTodo();
});

function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false,
            createdAt: new Date().toLocaleString(),
            completedAt: null
        };
        allTodos.push(todoObject);
        updateTodoLists();
        saveTodos();
        todoInput.value = "";
    }
}

function updateTodoLists() {
    pendingTodoListUL.innerHTML = "";
    completedTodoListUL.innerHTML = "";
    
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex);
        if (todo.completed) {
            completedTodoListUL.append(todoItem);
        } else {
            pendingTodoListUL.append(todoItem);
        }
    });
}

function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}" ${todo.completed ? 'checked' : ''}>
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z"/>
            </svg>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todo.text} (Created at: ${todo.createdAt}) ${todo.completed ? '(Completed at: ' + todo.completedAt + ')' : ''}
        </label>
        <button class="edit-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>        
        </button>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>
    `;
    
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex);
    });
    
    const editButton = todoLI.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
        const newText = prompt("Edit your task:", todo.text);
        if (newText) {
            todo.text = newText;
            saveTodos();
            updateTodoLists();
        }
    });
    
    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        todo.completedAt = todo.completed ? new Date().toLocaleString() : null;
        saveTodos();
        updateTodoLists();
    });
    
    return todoLI;
}

function saveTodos() {
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos);
}

function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex);
    saveTodos();
    updateTodoLists();
}
