from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from tensorflow.keras.models import load_model
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import pickle

app = Flask(__name__)

# Load data
recipe_data = pd.read_json('recipes.json')  # Ensure this path is correct
num_users = 1000  # Adjust as per your data
num_recipes = len(recipe_data)

# Load pre-trained TensorFlow model
model = load_model('recommendation_model.h5')  # Ensure you save the trained model as .h5

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_id = int(data["user_id"])
    
    all_recipe_ids = np.arange(num_recipes)
    predictions = model.predict([np.full(len(all_recipe_ids), user_id), all_recipe_ids])
    
    recommended_recipes = all_recipe_ids[np.argsort(-predictions.flatten())[:10]]
    return jsonify({"recommended_recipe_ids": recommended_recipes.tolist()})

if __name__ == "__main__":
    app.run(port=5001)
