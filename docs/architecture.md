# CartRescue AI – Enterprise System Architecture & Technical Specifications

CartRescue AI is a real-time, explainable cart abandonment prediction and policy-bounded recovery SaaS application engineered for high-scale e-commerce operations.

---

## High-Level Component Interaction

```
[ React 19 Frontend ]  <--->  [ Spring Boot 3 REST API ]  <--->  [ MySQL 8.0 DB ]
                                       |
                                       v  (HTTP / JSON)
                            [ Python ML Engine ]
                             (XGBoost + SHAP)
                                       |
                                       v
                             [ Intent Diagnosis ]
                             [ Remediation Policy ]
```

---

## Subsystem Specifications

### 1. Spring Boot Backend API (`/backend`)
- **Framework**: Spring Boot 3.2, Java 21 LTS
- **Security**: Spring Security + JWT Stateless Authentication
- **Persistence**: Spring Data JPA + Hibernate ORM
- **API Spec**: OpenAPI 3.0 (Swagger UI at `/api/v1/swagger-ui.html`)
- **Key Services**:
  - `SessionService`: Manages ingestion and pageable queries of live clickstream sessions.
  - `PredictionService`: Communicates with Python ML service via RestTemplate with automatic fallback heuristics.
  - `AnalyticsService`: Aggregates real-time intent breakdowns, lost cart GMV, and margin ROI metrics.
  - `InterventionService`: Logs and dispatches policy-bounded recovery actions (WhatsApp, SMS, Email, Coupon).

### 2. Machine Learning & Explainable AI Service (`/ml-service`)
- **Framework**: Python 3.10+, FastAPI, Uvicorn
- **Algorithm**: XGBoost Classifier (n_estimators=150, max_depth=5, learning_rate=0.05)
- **Explainability**: SHAP (SHapley Additive exPlanations) `TreeExplainer` providing local feature attributions.
- **Customer Intent Engine**: Multi-dimensional classifier (`Payment Issue`, `Price Sensitive`, `Buy Later`, `Buy Now`, `Delivery Concern`, `Window Shopper`, `High Risk`).
- **Policy Recommendation Engine**: Enforces strict margin protection guardrails, selecting EXACTLY ONE action.

### 3. React 19 Frontend Dashboard (`/frontend`)
- **Stack**: React 19, Vite, Tailwind CSS, Material UI, Chart.js, React Router
- **Features**:
  - Executive Overview Dashboard with KPIs & real-time trends.
  - Live Monitored Clickstream Sessions table.
  - Diagnostic Drawer with Risk Score gauge, SHAP Feature attributions, Intent Diagnosis, and Execution triggers.
  - Dark / Light Mode responsive interface.

---

## Security & Compliance
- Passwords stored as BCrypt hashes.
- Stateless JWT Authorization Bearer tokens.
- CORS restricted origins with strict headers.
