const express = require('express');
const cors = require('cors');
const app = express();
const recipeRoutes = require('./routes/recipeRoutes');
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json()); // Apply body parsing for requests that need it (POST, PUT, etc.)
app.use(cors());  // Allow cross-origin requests from frontend

// API Routes
app.use('/api', recipeRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
