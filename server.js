import { todoRouter } from './todos.js';
// Add near top of server.js
import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { join } from 'path';  // Importing the 'join' method from 'path'

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
const port = 3000;
app.use(express.static('client'));
// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use routes
app.use('/api', todoRouter);

// Basic route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'client/index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
process.on("SIGINT", () => {
  console.log("Stopping server...");
  server.close(() => {
    console.log("Server stopped. Port released.");
    process.exit(0);
  });
});
