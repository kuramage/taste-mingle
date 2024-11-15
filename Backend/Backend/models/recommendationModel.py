import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
import tensorflow as tf
from tensorflow.keras import layers, Model

# Fix encoding issue
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Load data
def loadData(filePath: str) -> pd.DataFrame:
    return pd.read_json(filePath)

# Select relevant features
def selectRelevantFeatures(data: pd.DataFrame) -> pd.DataFrame:
    relevantFeatures = [
        "cook_time", "prep_time", "calories", "protein", "carbohydratebydifference", 
        "totallipidfat", "region", "continent", "sub_region"
    ]
    return data[relevantFeatures]

# Preprocess categorical and numerical features
def preprocessData(data: pd.DataFrame) -> np.ndarray:
    categoricalFeatures = ["region", "continent", "sub_region"]
    numericalFeatures = ["cook_time", "prep_time", "calories", "protein", "carbohydratebydifference", "totallipidfat"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numericalFeatures),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categoricalFeatures),
        ]
    )

    return preprocessor.fit_transform(data)

# Build and compile model
def buildModel(numUsers: int, numRecipes: int) -> Model:
    userInput = layers.Input(shape=(1,), name="User_Input")
    recipeInput = layers.Input(shape=(1,), name="Recipe_Input")

    embeddingSize = 50
    userEmbedding = layers.Embedding(numUsers, embeddingSize, name="User_Embedding")(userInput)
    recipeEmbedding = layers.Embedding(numRecipes, embeddingSize, name="Recipe_Embedding")(recipeInput)

    userVector = layers.Flatten()(userEmbedding)
    recipeVector = layers.Flatten()(recipeEmbedding)

    dotProduct = layers.Dot(axes=1)([userVector, recipeVector])

    output = layers.Dense(1, activation="sigmoid", name="Output")(dotProduct)

    model = Model(inputs=[userInput, recipeInput], outputs=output)
    model.compile(optimizer="adam", loss="binary_crossentropy", metrics=["accuracy"])

    return model

# Train the model
def trainModel(model: Model, trainUsers: np.ndarray, trainRecipes: np.ndarray, trainSwipes: np.ndarray, 
               testUsers: np.ndarray, testRecipes: np.ndarray, testSwipes: np.ndarray) -> Model:
    model.fit(
        [trainUsers, trainRecipes],
        trainSwipes,
        validation_data=([testUsers, testRecipes], testSwipes),
        epochs=10,
        batch_size=64
    )
    return model

# Predict swipe likelihoods for a user
def predictRecommendations(model: Model, userId: int, numRecipes: int) -> np.ndarray:
    allRecipeIds = np.arange(numRecipes)
    predictions = model.predict([np.full(len(allRecipeIds), userId), allRecipeIds])
    return allRecipeIds[np.argsort(-predictions.flatten())[:10]]

# Main workflow
recipeData = loadData('recipes.json')  # Replace with your actual data source
recipes = selectRelevantFeatures(recipeData)

processedData = preprocessData(recipes)

numUsers = 1000  # Replace with actual unique user count
numRecipes = len(recipeData)

userIds = np.random.randint(0, numUsers, size=10000)
recipeIds = np.random.randint(0, numRecipes, size=10000)
swipes = np.random.randint(0, 2, size=10000)

trainUsers, testUsers, trainRecipes, testRecipes, trainSwipes, testSwipes = train_test_split(
    userIds, recipeIds, swipes, test_size=0.2, random_state=42
)

trainUsers = trainUsers.reshape(-1, 1)
trainRecipes = trainRecipes.reshape(-1, 1)
testUsers = testUsers.reshape(-1, 1)
testRecipes = testRecipes.reshape(-1, 1)

model = buildModel(numUsers, numRecipes)

model = trainModel(model, trainUsers, trainRecipes, trainSwipes, testUsers, testRecipes, testSwipes)

model.save('recipe_recommendation_model.h5')

# Predicting for a user
userId = 123
recommendedRecipes = predictRecommendations(model, userId, numRecipes)
print("Recommended Recipe IDs:", recommendedRecipes)
