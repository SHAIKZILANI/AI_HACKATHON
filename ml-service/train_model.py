import os
import json
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

from dataset_generator import generate_datasets
from feature_engineering import engineer_features_from_df, FEATURE_COLUMNS

def train_and_save_model():
    base_dir = os.path.dirname(__file__)
    data_dir = os.path.join(base_dir, "data")
    models_dir = os.path.join(base_dir, "models")
    os.makedirs(models_dir, exist_ok=True)

    sessions_path = os.path.join(data_dir, "sessions.csv")
    customers_path = os.path.join(data_dir, "customers.csv")

    if not os.path.exists(sessions_path) or not os.path.exists(customers_path):
        print("Dataset files missing. Generating synthetic enterprise clickstream dataset...")
        generate_datasets()

    df_sessions = pd.read_csv(sessions_path)
    df_customers = pd.read_csv(customers_path)

    X, y = engineer_features_from_df(df_sessions, df_customers)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Initialize & Train XGBoost Model
    model = xgb.XGBClassifier(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric='logloss'
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, y_prob)
    cm = confusion_matrix(y_test, y_pred).tolist()

    # Save Model Artifact
    model_filepath = os.path.join(models_dir, "xgboost_cartrescue.joblib")
    joblib.dump(model, model_filepath)

    metadata = {
        "model_type": "XGBoostClassifier",
        "n_estimators": 150,
        "features": FEATURE_COLUMNS,
        "metrics": {
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1_score": float(f1),
            "roc_auc": float(roc_auc),
            "confusion_matrix": cm
        }
    }

    metadata_path = os.path.join(models_dir, "model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=4)

    print("==========================================")
    print("XGBoost Model Training Completed Successfully!")
    print(f"Accuracy:  {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall:    {recall:.4f}")
    print(f"F1 Score:  {f1:.4f}")
    print(f"ROC AUC:   {roc_auc:.4f}")
    print(f"Saved Model: {model_filepath}")
    print("==========================================")

    return metadata

if __name__ == "__main__":
    train_and_save_model()
