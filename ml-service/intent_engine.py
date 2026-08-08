def classify_customer_intent(risk_score, features_dict):
    """
    Multi-dimensional customer intent classification engine.
    Diagnoses underlying behavioral motivation beyond simple binary risk scoring.
    """
    payment_failures = int(features_dict.get('payment_failures', 0))
    cart_value = float(features_dict.get('cart_value', 0.0))
    duration = float(features_dict.get('session_duration_sec', 0.0))
    revisits = int(features_dict.get('cart_revisit_count', 0))
    checkout_attempts = int(features_dict.get('checkout_attempts', 0))
    clv = float(features_dict.get('customer_clv', 0.0))
    
    # 1. Technical Payment Failure Intent
    if payment_failures > 0:
        return {
            "intent": "Payment Issue",
            "confidence": min(0.85 + (payment_failures * 0.05), 0.99),
            "explanation": f"Detected {payment_failures} gateway technical failure(s) during active checkout."
        }

    # 2. Low Risk -> Intent to Buy Now
    if risk_score < 0.35:
        return {
            "intent": "Buy Now",
            "confidence": float(1.0 - risk_score),
            "explanation": "High buyer intent with minimal conversion friction detected."
        }

    # 3. High Price Sensitivity / Comparison Shopping
    if cart_value > 8000 and revisits >= 3 and checkout_attempts <= 1:
        return {
            "intent": "Price Sensitive",
            "confidence": 0.88,
            "explanation": f"Multiple cart revisits ({revisits} times) for high-value items (₹{cart_value:,.2f}) indicating price evaluation."
        }

    # 4. Intent to Buy Later / Saved Session
    if duration > 900 and revisits >= 2 and checkout_attempts == 0:
        return {
            "intent": "Buy Later",
            "confidence": 0.82,
            "explanation": "Long session duration with repeated saves, indicating delayed purchase intent."
        }

    # 5. Delivery Concern / Friction at Shipping Step
    if checkout_attempts >= 2 and payment_failures == 0 and duration > 500:
        return {
            "intent": "Delivery Concern",
            "confidence": 0.84,
            "explanation": "Repeated checkout page loads without payment attempt, indicating shipping fee or ETA hesitation."
        }

    # 6. Casual Browsing / Window Shopper
    if cart_value < 1500 and duration < 250 and checkout_attempts == 0:
        return {
            "intent": "Window Shopper",
            "confidence": 0.90,
            "explanation": "Low-value cart with rapid exploration behavior and no checkout progression."
        }

    # 7. High Risk Abandonment Default
    return {
        "intent": "High Risk",
        "confidence": float(risk_score),
        "explanation": "Unfavorable interaction signals pointing to imminent cart abandonment."
    }
