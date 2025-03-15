// Get DOM HTML Elements
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");

// Fetch all todos when page loads
async function fetchTodos() {
  try {
    const response = await fetch("/api/todos");
    const todos = await response.json();
    displayTodos(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// Display todos in the list
function displayTodos(todos) {
  todoList.innerHTML = ""; // Clear the current list

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = todo.title;
    li.id = todo._id;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-btn");
    deleteButton.addEventListener("click", () => {
      // Call the deleteTodo function when clicked
      deleteTodo(todo._id);
    });

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.classList.add("update-btn");
    updateButton.addEventListener("click", () => {
      const updatedTitle = prompt("Edit your todo:", todo.title);
      if (updatedTitle) {
        updateTodo(todo._id, updatedTitle);
      }
    });

    li.appendChild(updateButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });
}

// Delete a todo
async function deleteTodo(todoId) {
  try {
    await fetch(`/api/todos/${todoId}`, {
      method: "DELETE",
    });

    // After deletion, fetch the updated list of todos
    fetchTodos();
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
}

// Update a todo
async function updateTodo(id, updatedTitle) {
  try {
    const updatedTodo = { title: updatedTitle };
    const response = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTodo),
    });

    if (response.ok) {
      fetchTodos(); // Refresh the todo list
    } else {
      alert("Failed to update todo");
    }
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

// Handle form submission to add a new todo
todoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const todoTitle = todoInput.value.trim();
  if (!todoTitle) {
    alert("Please enter a todo!");
    return;
  }

  const newTodo = { title: todoTitle };

  try {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    if (response.ok) {
      todoInput.value = ""; // Clear input field
      fetchTodos(); // Refresh the todo list with the new todo
    } else {
      alert("Failed to add todo");
    }
  } catch (error) {
    console.error("Error adding todo:", error);
  }
});

// Load todos when page loads
fetchTodos();
