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

// Display todos in the list
function displayTodos(todos) {
    todoList.innerHTML = ''; // Clear the current list
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.title; // Assuming each todo has a 'title' property
        
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
                    fetchTodos(); // Re-fetch the todos after deletion
                } else {
                    alert('Failed to delete todo');
                }
            } catch (error) {
                console.error('Error deleting todo:', error);
            }
        });

        // Append the delete button to the list item
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });
}


// Handle form submission
todoForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from reloading the page
    
    const todoText = todoInput.value.trim();
    if (!todoText) {
        alert('Please enter a todo!');
        return;
    }

    const newTodo = { title: todoText };
    
    // Send POST request to add a new todo
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        });

        if (response.ok) {
            const addedTodo = await response.json();
            displayTodos([addedTodo]); // Re-fetch and display todos
        } else {
            alert('Failed to add todo');
        }
    } catch (error) {
        console.error('Error adding todo:', error);
    }

    todoInput.value = ''; // Clear input field
});

// Load todos when page loads
fetchTodos();
