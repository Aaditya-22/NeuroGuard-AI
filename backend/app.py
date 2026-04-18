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
    # ... (Keep your existing predict logic here) ...
    return jsonify({"risk_level": "Low Risk 🟢"}) # Placeholder for your logic

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)