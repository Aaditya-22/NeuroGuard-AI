import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import sqlite3

app = Flask(__name__)

# 1. THE SECURITY DOOR: This allows your Vercel site to talk to Render
CORS(app, resources={r"/*": {"origins": "*"}}) 

# 2. THE DATABASE PATH: This tells Render exactly where the file is
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "users.db")

def get_db():
    conn = sqlite3.connect(db_path, check_same_thread=False)
    return conn

# Create table if it doesn't exist
with get_db() as conn:
    conn.execute("CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT)")
    conn.commit()

# Load Model
try:
    model_path = os.path.join(basedir, "model.pkl")
    with open(model_path, "rb") as f:
        model = pickle.load(f)
except Exception as e:
    print(f"Model Load Warning: {e}")
    model = None

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    try:
        with get_db() as conn:
            conn.execute("INSERT INTO users VALUES (?, ?)", (email, password))
            conn.commit()
        return jsonify({"message": "Success"}), 201
    except Exception as e:
        print(f"Register Error: {e}")
        return jsonify({"message": "Exists or Error"}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    with get_db() as conn:
        cursor = conn.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password))
        user = cursor.fetchone()
    if user:
        return jsonify({"message": "Login Successful"}), 200
    return jsonify({"message": "Failed"}), 401

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    
    # 1. Pull scores from the game
    m = float(data.get("memory_score", 0))
    s = float(data.get("sequence_score", 0))
    st = float(data.get("stroop_score", 0))
    p = float(data.get("pattern_score", 0))
    r = float(data.get("reaction_time", 0))
    
    # 2. Get the current difficulty level
    current_diff = float(data.get("current_difficulty", 1.0))

    # 3. Calculate Average and Probability
    avg_mem = (m + s + st + p) / 4
    prob = 0.15 
    
    if model:
        try:
            # Preparing features for the AI model
            err_rate = 1.0 - avg_mem
            const_val = 0.9 if (avg_mem > 0.7 and r < 1.5) else 0.2
            features = np.array([[avg_mem, r, err_rate, const_val]])
            prob = model.predict_proba(features)[0][1]
        except:
            prob = 0.85 if avg_mem < 0.4 else 0.15

    # 4. Determine Risk and NEW Difficulty
    if prob > 0.45 or avg_mem < 0.4:
        risk_level = "High Risk 🔴"
        # Ease up on the user if they are struggling
        next_diff = max(1.0, round(current_diff - 0.1, 2))
    elif prob > 0.20:
        risk_level = "Medium Risk 🟡"
        next_diff = current_diff # Keep it steady
    else:
        risk_level = "Low Risk 🟢"
        # Challenge the user more!
        next_diff = round(current_diff + 0.2, 2)

    # 5. Generate AI Insights
    insights = []
    if avg_mem < 0.5: insights.append("Significant cognitive lapses detected.")
    if r > 2.0: insights.append("Motor response speed is delayed.")
    if not insights: insights.append("Cognitive markers are stable.")

    # 6. Send the package back to React
    return jsonify({
        "risk_level": risk_level,
        "probability": f"{prob * 100:.0f}%",
        "explanation": insights,
        "next_difficulty": next_diff 
    })

if __name__ == "__main__":
    # Render uses the PORT environment variable
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)