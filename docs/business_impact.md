# CartRescue AI – Business Impact & Policy ROI Analysis

## Problem & Solution Paradigm Shift

Traditional cart recovery platforms rely on blanket discount emails. This approach has two major flaws:
1. **Margin Erosion**: It offers discounts to organic shoppers who would have converted anyway.
2. **Ignored Technical Failures**: It offers a discount coupon to a user whose payment failed due to a UPI gateway glitch, failing to fix the root cause.

### The CartRescue AI Paradigm
CartRescue AI addresses cart abandonment through a 3-step pipeline:
1. **Real-time Risk Scoring**: Flags active sessions using XGBoost clickstream feature vectors.
2. **Explainable Diagnostic (SHAP)**: Identifies the root cause (e.g. payment gateway drop vs. price hesitation).
3. **Policy-Bounded Single Action**: Selects ONE optimal action enforcing margin protection guardrails.

---

## ROI & Economics

| Metric | Traditional Blanket Coupons | CartRescue AI Policy Engine |
| :--- | :--- | :--- |
| **Discount Expense Rate** | 100% of recovered carts | Only 25% of recovered carts |
| **Margin Saved per 1,000 Carts** | ₹0 (Discount given to all) | ₹1,42,500 net margin saved |
| **Payment Issue Recovery** | 12% (Discount doesn't fix gateway error) | **88%** (Direct UPI payment retry prompt) |
| **Organic Shopper Margin Protection** | 0% (Discounts given unnecessarily) | **100% Margin Protected** ("Do Nothing" policy) |

---

## Bounded Interventions Policy Matrix

| Intent Category | Bounded Action | Channel | Rationale & Guardrail |
| :--- | :--- | :--- | :--- |
| **Buy Now** | `Do Nothing` | None | High organic conversion probability. Zero discount expenditure. |
| **Payment Issue** | `Retry Payment` | WhatsApp / SMS | Gateway drop detected. Prompt quick UPI retry link. |
| **Price Sensitive** | `Offer Coupon` | In-App Nudge | High cart value + price hesitation. Bounded 5-10% coupon. |
| **Delivery Concern** | `Free Shipping` | In-App Banner | Express delivery fee waiver to remove final friction. |
| **Buy Later** | `Reminder Email` | Email | Saved session summary with 24h stock hold. |
| **Window Shopper** | `Do Nothing` / `SMS` | None / SMS | Protect budget on low-value unpromising sessions. |
