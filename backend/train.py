import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

# 1. Load data
try:
    data = pd.read_csv("data.csv")
except FileNotFoundError:
    print("Error: data.csv not found.")
    exit()

# 2. Define Features and Labels
X = data[['memory_score', 'reaction_time', 'error_rate', 'consistency']]
y = data['label']

# 3. Train Model with high sensitivity
model = RandomForestClassifier(
    n_estimators=100, 
    class_weight='balanced', # Crucial for detecting risk
    random_state=42
)
model.fit(X, y)

# 4. Save
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ AI Brain trained successfully and balanced for risk detection.")