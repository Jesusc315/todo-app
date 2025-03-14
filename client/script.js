// Get DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');

// Fetch all todos when page loads
async function fetchTodos() {
    try {
        const response = await fetch('/api/todos'); // Assuming your API is at /api/todos
        const todos = await response.json();
        displayTodos(todos);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
}

// Display todos in the list (initial load)
function displayTodos(todos) {
    todoList.innerHTML = ''; // Clear the current list

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.title; // Assuming each todo has a 'title' property
        li.id = todo._id; // Set unique id for the todo item

        // Create a delete button for each todo
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.style.marginLeft = '10px'; // Add some space between the title and button

        // Add an event listener to the delete button
        deleteButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`/api/todos/${todo._id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Todo deleted');
                    li.remove(); // Remove the todo from the DOM immediately
                } else {
                    alert('Failed to delete todo');
                }
            } catch (error) {
                console.error('Error deleting todo:', error);
            }
        });

        // Create an update button for each todo
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.style.marginLeft = '10px';

        // Add event listener to the update button
        updateButton.addEventListener('click', async () => {
            const newTitle = prompt('Enter new title', todo.title);
            if (newTitle && newTitle !== todo.title) {
                try {
                    const response = await fetch(`/api/todos/${todo._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ title: newTitle })
                    });

                    if (response.ok) {
                        const updatedTodo = await response.json();
                        alert('Todo updated');
                        li.textContent = updatedTodo.title; // Update the title on the DOM
                        li.appendChild(deleteButton); // Re-append delete button after updating title
                        li.appendChild(updateButton); // Re-append update button
                    } else {
                        alert('Failed to update todo');
                    }
                } catch (error) {
                    console.error('Error updating todo:', error);
                }
            }
        });

        // Append buttons to the list item
        li.appendChild(deleteButton);
        li.appendChild(updateButton);

        // Append the list item to the todo list
        todoList.appendChild(li);
    });
}

// Handle form submission (adding a new todo)
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const todoText = todoInput.value.trim();
    if (!todoText) {
        alert('Please enter a todo!');
        return;
    }

    const newTodo = { title: todoText };
    console.log("added Todo");

    // Send POST request to add a new todo
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        });

        if (response.ok) {
            const addedTodo = await response.json();
            // Directly append the new todo to the list (without re-fetching all todos)
            displayNewTodo(addedTodo);
        } else {
            alert('Failed to add todo');
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }

    todoInput.value = ''; // Clear input field
});

// Display the new todo without reloading all todos
function displayNewTodo(todo) {
    const li = document.createElement('li');
    li.textContent = todo.title; // Assuming each todo has a 'title' property
    li.id = todo._id; // Set unique id for the todo item

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.style.marginLeft = '10px'; // Add some space between the title and button

    deleteButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/todos/${todo._id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Todo deleted');
                li.remove(); // Remove the todo from the DOM immediately
            } else {
                alert('Failed to delete todo');
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    });

    // Create update button for new todo
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.style.marginLeft = '10px';

    updateButton.addEventListener('click', async () => {
        const newTitle = prompt('Enter new title', todo.title);
        if (newTitle && newTitle !== todo.title) {
            try {
                const response = await fetch(`/api/todos/${todo._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTitle })
                });

                if (response.ok) {
                    const updatedTodo = await response.json();
                    alert('Todo updated');
                    li.textContent = updatedTodo.title; // Update the title on the DOM
                    li.appendChild(deleteButton); // Re-append delete button after updating title
                    li.appendChild(updateButton); // Re-append update button
                } else {
                    alert('Failed to update todo');
                }
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        }
    });

    // Append buttons to the list item
    li.appendChild(deleteButton);
    li.appendChild(updateButton);

    // Append the new todo item to the list
    todoList.appendChild(li);
}

// Load todos when page loads
fetchTodos();
