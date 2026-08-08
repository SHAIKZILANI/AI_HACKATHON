import shap
import numpy as np

HUMAN_FEATURE_NAMES = {
    'payment_failures': 'Payment Gateway Failures',
    'checkout_attempts': 'Checkout Funnel Attempts',
    'cart_value': 'Cart Monetary Value',
    'session_duration_sec': 'Session Inactivity / Idle Time',
    'cart_revisit_count': 'Cart Revisit Frequency',
    'price_per_item': 'Item Price Sensitivity',
    'payment_failure_rate': 'Payment Failure Frequency',
    'has_payment_issue': 'Technical Gateway Drop',
    'customer_clv': 'Customer Lifetime Value',
    'customer_total_orders': 'Historical Order Count'
}

def generate_shap_explanation(model, df_single):
    """
    Computes SHAP values for a single prediction and generates human-readable diagnostic insights.
    """
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(df_single)

    # For binary classification TreeExplainer, shap_values can be 1D or 2D array
    if isinstance(shap_values, list):
        vals = shap_values[1][0]
    elif len(np.array(shap_values).shape) == 2:
        vals = shap_values[0]
    else:
        vals = shap_values

    feature_names = df_single.columns.tolist()
    feature_impacts = []

    for name, val in zip(feature_names, vals):
        feature_impacts.append({
            "feature": name,
            "display_name": HUMAN_FEATURE_NAMES.get(name, name.replace('_', ' ').title()),
            "shap_value": float(val),
            "actual_value": float(df_single[name].values[0])
        })

    # Sort by absolute SHAP contribution
    feature_impacts.sort(key=lambda x: abs(x['shap_value']), reverse=True)
    top_features = feature_impacts[:4]

    # Construct Human Readable Business Explanation
    human_reasons = []
    for item in top_features:
        f_name = item['feature']
        f_val = item['actual_value']
        s_val = item['shap_value']

        if s_val > 0.05:
            if f_name == 'payment_failures' and f_val > 0:
                human_reasons.append(f"Customer encountered {int(f_val)} payment gateway failure(s).")
            elif f_name == 'cart_value' and f_val > 10000:
                human_reasons.append(f"High cart monetary value (₹{f_val:,.2f}) creating price hesitation.")
            elif f_name == 'session_duration_sec' and f_val > 600:
                human_reasons.append(f"Extended idle session time ({int(f_val//60)} mins) without order placement.")
            elif f_name == 'cart_revisit_count' and f_val > 2:
                human_reasons.append(f"Revisited cart {int(f_val)} times without proceeding to payment.")
            elif f_name == 'checkout_attempts' and f_val > 1:
                human_reasons.append(f"Attempted checkout {int(f_val)} times unsuccessfully.")
            else:
                human_reasons.append(f"Elevated risk driven by {HUMAN_FEATURE_NAMES.get(f_name, f_name)} ({f_val}).")

    if not human_reasons:
        human_reasons.append("Standard browsing behavior pattern detected with typical conversion probability.")

    human_explanation = " ".join(human_reasons)

    return {
        "top_features": top_features,
        "human_explanation": human_explanation
    }
