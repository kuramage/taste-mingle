// routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const { getRecipeRecommendations, startModelTraining } = require('../controllers/recipeController');

// Route to fetch recipe recommendations
router.get('/recommendations/:recipeId', getRecipeRecommendations);

// Route to start model training
router.get('/train-model', startModelTraining);

module.exports = router;
    