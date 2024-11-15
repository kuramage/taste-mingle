import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer

# Load data
recipe_data = pd.read_json('recipes.json')  # Replace with your actual data source

# Select relevant features
relevant_features = [
    "cook_time", "prep_time", "calories", "protein", "carbohydratebydifference", 
    "totallipidfat", "region", "continent", "sub_region"
]
recipes = recipe_data[relevant_features]

# Preprocess categorical and numerical features
categorical_features = ["region", "continent", "sub_region"]
numerical_features = ["cook_time", "prep_time", "calories", "protein", "carbohydratebydifference", "totallipidfat"]

# Column Transformer
preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
    ]
)

# Apply preprocessing
processed_data = preprocessor.fit_transform(recipes)


import tensorflow as tf
from tensorflow.keras import layers, Model

# User and recipe IDs
num_users = 1000  # Replace with actual unique user count
num_recipes = len(recipe_data)

# Input layers
user_input = layers.Input(shape=(1,), name="User_Input")
recipe_input = layers.Input(shape=(1,), name="Recipe_Input")

# Embeddings
embedding_size = 50  # Number of dimensions for embeddings
user_embedding = layers.Embedding(num_users, embedding_size, name="User_Embedding")(user_input)
recipe_embedding = layers.Embedding(num_recipes, embedding_size, name="Recipe_Embedding")(recipe_input)

# Flatten embeddings
user_vector = layers.Flatten()(user_embedding)
recipe_vector = layers.Flatten()(recipe_embedding)

# Dot product for interaction
dot_product = layers.Dot(axes=1)([user_vector, recipe_vector])

# Output layer with sigmoid activation
output = layers.Dense(1, activation="sigmoid", name="Output")(dot_product)

# Define and compile model
model = Model(inputs=[user_input, recipe_input], outputs=output)
model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

model.summary()


# Example data (replace with actual swipe data)
user_ids = np.random.randint(0, num_users, size=10000)
recipe_ids = np.random.randint(0, num_recipes, size=10000)
swipes = np.random.randint(0, 2, size=10000)

# Train-test split
train_users, test_users, train_recipes, test_recipes, train_swipes, test_swipes = train_test_split(
    user_ids, recipe_ids, swipes, test_size=0.2, random_state=42
)

# Train the model
history = model.fit(
    [train_users, train_recipes],
    train_swipes,
    validation_data=([test_users, test_recipes], test_swipes),
    epochs=10,
    batch_size=64
)

# Save the model after training
model.save('recipe_recommendation_model.h5')

# Predicting for a user
user_id = 123  # Replace with the target user ID
all_recipe_ids = np.arange(num_recipes)

# Predict swipe likelihoods
predictions = model.predict([np.full(len(all_recipe_ids), user_id), all_recipe_ids])

# Get top recommendations
recommended_recipes = all_recipe_ids[np.argsort(-predictions.flatten())[:10]]
print("Recommended Recipe IDs:", recommended_recipes)
