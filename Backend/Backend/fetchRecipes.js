const axios = require('axios');
const fs = require('fs');

// List of recipe IDs you want to fetch
const recipeIds = [2610, 2611, 2612, 2613, 2614];  // Example, replace with actual recipe IDs

// Base URL for the API call
const baseUrl = "https://cosylab.iiitd.edu.in/recipe/";

// Function to fetch recipe details for a given recipe ID
const fetchRecipe = async (recipeId) => {
  try {
    const response = await axios.get(`${baseUrl}${recipeId}`);
    if (response.data.success === "true") {
      return response.data.payload;
    } else {
      console.log(`Failed to fetch recipe ${recipeId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching recipe ${recipeId}:`, error);
    return null;
  }
};

// Function to fetch multiple recipes and store them in an array
const fetchAllRecipes = async (recipeIds) => {
  const recipes = [];
  for (const recipeId of recipeIds) {
    const recipeData = await fetchRecipe(recipeId);
    if (recipeData) {
      recipes.push(recipeData);
    }
  }
  return recipes;
};

// Fetch all recipes and save to a JSON file
const saveRecipes = async () => {
  const recipes = await fetchAllRecipes(recipeIds);
  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2), 'utf-8');
  console.log(`Fetched ${recipes.length} recipes and saved to 'recipes.json'`);
};

// Start the process
saveRecipes();
