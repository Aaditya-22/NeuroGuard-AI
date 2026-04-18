import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import sqlite3

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, "users.db")

def get_db():
    conn = sqlite3.connect(db_path, check_same_thread=False)
    return conn

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
    try:
        with get_db() as conn:
            conn.execute("INSERT INTO users VALUES (?, ?)", (data['email'], data['password']))
            conn.commit()
        return jsonify({"message": "Success"}), 201
    except:
        return jsonify({"message": "Exists"}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    with get_db() as conn:
        cursor = conn.execute("SELECT * FROM users WHERE email=? AND password=?", (data['email'], data['password']))
        user = cursor.fetchone()
    if user:
        return jsonify({"message": "Login Successful"}), 200
    return jsonify({"message": "Failed"}), 401

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    
    # 1. Get scores from games
    m = float(data.get("memory_score", 0))
    s = float(data.get("sequence_score", 0))
    st = float(data.get("stroop_score", 0))
    p = float(data.get("pattern_score", 0))
    r = float(data.get("reaction_time", 0))

    # 2. Math Logic
    avg_mem = (m + s + st + p) / 4
    prob = 0.15 
    
    if model:
        try:
            err_rate = 1.0 - avg_mem
            const_val = 0.9 if (avg_mem > 0.7 and r < 1.5) else 0.2
            features = np.array([[avg_mem, r, err_rate, const_val]])
            prob = model.predict_proba(features)[0][1]
        except:
            prob = 0.85 if avg_mem < 0.4 else 0.15

    # 3. Choose the Color/Risk
    if prob > 0.45 or avg_mem < 0.4:
        risk_level = "High Risk 🔴"
    elif prob > 0.20:
        risk_level = "Medium Risk 🟡"
    else:
        risk_level = "Low Risk 🟢"

    # 4. Write the "AI Insights"
    insights = []
    if avg_mem < 0.5: insights.append("Significant cognitive lapses detected.")
    if r > 2.0: insights.append("Motor response speed is delayed.")
    if not insights: insights.append("Cognitive markers are stable.")

    # 5. Send EVERYTHING back to the website
    return jsonify({
        "risk_level": risk_level,
        "probability": f"{prob * 100:.0f}%", # This makes it look like "15%"
        "explanation": insights
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)