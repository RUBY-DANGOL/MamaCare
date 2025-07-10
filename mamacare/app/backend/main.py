# backend/main.py

from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
import joblib
import math

app = FastAPI()

# Allow all origins for simplicity (dev only)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

recommender = joblib.load("recommender_model.joblib")

def calculate_bmi(weight_kg, height_cm):
    height_m = height_cm / 100
    return round(weight_kg / (height_m ** 2), 1)

def calorie_goal_by_bmi(bmi):
    if bmi < 18.5:
        return 2600
    elif bmi < 25:
        return 2500
    elif bmi < 30:
        return 2300
    else:
        return 2100

@app.post("/recommend")
def recommend_food(
    weight: float = Body(...),
    height: float = Body(...),
    region: str = Body(...),
    foods: list = Body(default=[]),  # List of foods logged by user
):
    bmi = calculate_bmi(weight, height)
    calorie_goal = calorie_goal_by_bmi(bmi)
    # Recommend top 5 foods to fill the gap
    recommendations = recommender.recommend_by_gap(region, foods, top_n=5)
    return {
        "bmi": bmi,
        "calorie_goal": calorie_goal,
        "recommendations": recommendations.to_dict(orient="records"),
    }
