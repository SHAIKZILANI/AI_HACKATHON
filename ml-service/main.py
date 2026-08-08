import os
import json
import joblib
import pandas as pd
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from feature_engineering import engineer_features_single, FEATURE_COLUMNS
from explainability import generate_shap_explanation
from intent_engine import classify_customer_intent
from recommendation_engine import recommend_intervention
from train_model import train_and_save_model

app = FastAPI(
    title="CartRescue AI - Machine Learning Prediction & Diagnostics Service",
    description="Enterprise Real-Time Cart Abandonment Risk Scoring, SHAP Explainability & Remediation Policy Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Model & Metadata Container
MODEL = None
METADATA = None

def load_ml_model():
    global MODEL, METADATA
    base_dir = os.path.dirname(__file__)
    model_path = os.path.join(base_dir, "models", "xgboost_cartrescue.joblib")
    metadata_path = os.path.join(base_dir, "models", "model_metadata.json")

    if not os.path.exists(model_path):
        print("Model file not found. Running training process...")
        train_and_save_model()

    MODEL = joblib.load(model_path)
    if os.path.exists(metadata_path):
        with open(metadata_path, "r") as f:
            METADATA = json.load(f)

@app.on_event("startup")
def startup_event():
    load_ml_model()

class SessionPayload(BaseModel):
    session_id: str = Field(..., example="sess_982341")
    customer_id: Optional[int] = Field(default=1)
    session_duration_sec: float = Field(default=300.0, example=900.0)
    cart_value: float = Field(default=0.0, example=29990.0)
    items_count: int = Field(default=1, example=1)
    checkout_attempts: int = Field(default=0, example=2)
    payment_failures: int = Field(default=0, example=2)
    cart_revisit_count: int = Field(default=1, example=3)
    is_weekend: int = Field(default=0, example=0)
    is_night: int = Field(default=0, example=0)
    customer_total_orders: int = Field(default=0, example=12)
    customer_total_spent: float = Field(default=0.0, example=48500.0)
    customer_aov: float = Field(default=0.0, example=4041.67)
    customer_clv: float = Field(default=0.0, example=85000.0)

class PredictionResponse(BaseModel):
    session_id: str
    abandonment_risk_score: float
    intent_category: str
    intent_confidence: float
    intent_explanation: str
    recommended_action: str
    recommendation_reason: str
    expected_impact: str
    recommendation_confidence: float
    channel: str
    human_reason: str
    top_features: List[Dict[str, Any]]
    metrics_version: Optional[Dict[str, Any]] = None

@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    return {
        "status": "UP",
        "service": "CartRescue ML Engine",
        "model_loaded": MODEL is not None,
        "features_count": len(FEATURE_COLUMNS)
    }

@app.post("/predict", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
def predict_session_risk(payload: SessionPayload):
    if MODEL is None:
        raise HTTPException(status_code=500, detail="ML Model is not initialized.")

    payload_dict = payload.dict()
    df_single = engineer_features_single(payload_dict)

    # 1. XGBoost Risk Probability Prediction
    risk_prob = float(MODEL.predict_proba(df_single)[:, 1][0])

    # 2. SHAP Explainability Engine
    shap_info = generate_shap_explanation(MODEL, df_single)

    # 3. Intent Engine Diagnosis
    intent_info = classify_customer_intent(risk_prob, payload_dict)

    # 4. Bounded Policy Recommendation Engine
    rec_info = recommend_intervention(risk_prob, intent_info, payload_dict)

    return PredictionResponse(
        session_id=payload.session_id,
        abandonment_risk_score=round(risk_prob, 4),
        intent_category=intent_info['intent'],
        intent_confidence=round(intent_info['confidence'], 4),
        intent_explanation=intent_info['explanation'],
        recommended_action=rec_info['action'],
        recommendation_reason=rec_info['reason'],
        expected_impact=rec_info['expected_impact'],
        recommendation_confidence=round(rec_info['confidence_score'], 4),
        channel=rec_info['channel'],
        human_reason=shap_info['human_explanation'],
        top_features=shap_info['top_features'],
        metrics_version=METADATA.get("metrics") if METADATA else None
    )

@app.post("/train", status_code=status.HTTP_200_OK)
def trigger_retraining():
    metadata = train_and_save_model()
    load_ml_model()
    return {
        "message": "Retraining completed successfully",
        "metadata": metadata
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
