const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory storage for todos
let todos = [];

// Routes
// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos, "Make sure to add a todo");
});

// Create a new todo
app.post('/todos', (req, res) => {
  const { title, completed } = req.body;
  const newTodo = { id: Date.now(), title, completed: completed || false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update a todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  const todo = todos.find((t) => t.id === parseInt(id));

  if (todo) {
    todo.title = title !== undefined ? title : todo.title;
    todo.completed = completed !== undefined ? completed : todo.completed;
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex((t) => t.id === parseInt(id));

  if (index !== -1) {
    const deletedTodo = todos.splice(index, 1);
    res.json(deletedTodo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Mark all todos as completed
app.patch('/todos/mark-all-completed', (req, res) => {
  todos = todos.map((todo) => ({ ...todo, completed: true }));
  res.json(todos);
});

// Get a single todo by ID
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  const todo = todos.find((t) => t.id === parseInt(id));

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// Clear all completed todos
app.delete('/todos/clear-completed', (req, res) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  todos = todos.filter((todo) => !todo.completed);
  res.json(completedTodos);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});