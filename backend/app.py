import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import sqlite3

app = Flask(__name__)

# 1. DYNAMIC CORS (Allows both local testing and your live website)
# Replace the Vercel link with your actual one!
CORS(app, resources={r"/*": {
    "origins": [
        "http://localhost:3000",
        "https://neuroguard-ai-aaditya.vercel.app" # <--- Put your Vercel link here
    ]
}})

# Database Setup
db = sqlite3.connect("users.db", check_same_thread=False)
cursor = db.cursor()
cursor.execute("CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, password TEXT)")
db.commit()

# Load Model
try:
    # Use absolute path for Render stability
    model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
    with open(model_path, "rb") as f:
        model = pickle.load(f)
except Exception as e:
    print(f"Model Load Warning: {e}")
    model = None

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    try:
        cursor.execute("INSERT INTO users VALUES (?, ?)", (data['email'], data['password']))
        db.commit()
        return jsonify({"message": "Success"}), 201
    except:
        return jsonify({"message": "Exists"}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    cursor.execute("SELECT * FROM users WHERE email=? AND password=?", (data['email'], data['password']))
    if cursor.fetchone():
        return jsonify({"message": "Login Successful"}), 200
    return jsonify({"message": "Failed"}), 401

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    
    # 1. Pull scores
    m = float(data.get("memory_score", 0))
    s = float(data.get("sequence_score", 0))
    st = float(data.get("stroop_score", 0))
    p = float(data.get("pattern_score", 0))
    r = float(data.get("reaction_time", 0))

    # 2. Match CSV Logic
    avg_mem = (m + s + st + p) / 4
    err_rate = 1.0 - avg_mem
    const_val = 0.9 if (avg_mem > 0.7 and r < 1.5) else 0.2

    # 3. Features array
    features = np.array([[avg_mem, r, err_rate, const_val]])
    
    prob = 0.15
    if model:
        try:
            prob = model.predict_proba(features)[0][1]
        except:
            prob = 0.85 if avg_mem < 0.4 else 0.15

    # 4. Strict Decision Logic
    if prob > 0.45 or avg_mem < 0.4:
        risk_level = "High Risk 🔴"
    elif prob > 0.20:
        risk_level = "Medium Risk 🟡"
    else:
        risk_level = "Low Risk 🟢"

    insights = []
    if avg_mem < 0.5: insights.append("Significant cognitive lapses detected.")
    if r > 2.0: insights.append("Motor response speed is heavily delayed.")
    if not insights: insights.append("Cognitive markers are stable.")

    return jsonify({
        "risk_level": risk_level,
        "probability": f"{prob:.2f}",
        "explanation": insights,
        "next_difficulty": 1.5 if avg_mem > 0.8 else 1.0
    })

# Render needs the port to be dynamic
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)