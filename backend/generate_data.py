import pandas as pd
import numpy as np

data = []

for i in range(500):
    memory = np.random.uniform(0.7, 1.0)
    reaction = np.random.uniform(1.0, 2.0)
    error = np.random.uniform(0.01, 0.2)
    consistency = np.random.uniform(0.7, 1.0)
    label = 0
    data.append([memory, reaction, error, consistency, label])

for i in range(500):
    memory = np.random.uniform(0.2, 0.7)
    reaction = np.random.uniform(2.0, 6.0)
    error = np.random.uniform(0.2, 0.7)
    consistency = np.random.uniform(0.2, 0.7)
    label = 1
    data.append([memory, reaction, error, consistency, label])

df = pd.DataFrame(data, columns=[
    "memory_score","reaction_time","error_rate","consistency","label"
])

df.to_csv("data.csv", index=False)

print("Big dataset generated!")