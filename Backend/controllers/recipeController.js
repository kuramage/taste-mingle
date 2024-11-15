// controllers/recipeController.js
const { spawn } = require('child_process'); // Import the spawn method from child_process
const path = require('path');

// Function to get recipe recommendations
module.exports.getRecipeRecommendations = (req, res) => {
  const { recipeId } = req.params;

  const recipeRecommendations = [
    { id: 1, name: 'Spaghetti Bolognese', ingredients: ['spaghetti', 'beef', 'tomato sauce'] },
    { id: 2, name: 'Chicken Curry', ingredients: ['chicken', 'curry powder', 'rice'] },
    { id: 3, name: 'Caesar Salad', ingredients: ['lettuce', 'chicken', 'Caesar dressing'] },
  ];

  const recipe = recipeRecommendations.find((r) => r.id === parseInt(recipeId));

  if (recipe) {
    res.status(200).json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
};

// Function to start model training
module.exports.startModelTraining = (req, res) => {
  // Resolve the path to your Python script
  const pythonScriptPath = path.join(__dirname, '..', 'models', 'recommendationModels.py'); // Adjusted the path

  // Start the Python script for model training
  const pythonProcess = spawn('python', [pythonScriptPath]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({ message: 'Model training started successfully' });
    } else {
      res.status(500).json({ message: 'Error occurred while starting model training', code: code });
    }
  });
};
