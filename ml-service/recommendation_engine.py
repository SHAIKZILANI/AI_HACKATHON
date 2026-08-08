def recommend_intervention(risk_score, intent_info, features_dict):
    """
    Policy-Bounded Recommendation Engine.
    Selects EXACTLY ONE optimal intervention action while enforcing strict margin protection guardrails.
    """
    intent = intent_info['intent']
    cart_value = float(features_dict.get('cart_value', 0.0))
    payment_failures = int(features_dict.get('payment_failures', 0))
    clv = float(features_dict.get('customer_clv', 0.0))

    # Guardrail 1: Low Risk Shoppers -> DO NOTHING to protect profit margin
    if risk_score < 0.35 or intent == "Buy Now":
        return {
            "action": "Do Nothing",
            "reason": "Shopper has organic high intent to convert. Protect margin by withholding unnecessary discounts.",
            "expected_impact": "Preserves 100% gross margin on organic sale.",
            "confidence_score": 0.95,
            "channel": "None"
        }

    # Policy 1: Technical Payment Failure -> Retry Payment via WhatsApp/SMS
    if intent == "Payment Issue" or payment_failures > 0:
        return {
            "action": "Retry Payment",
            "reason": f"Active session stalled by {payment_failures} gateway payment drop(s). Prompt user with quick UPI/Card retry link.",
            "expected_impact": f"High recovery probability (88%) of ₹{cart_value:,.2f} gross merchandise value.",
            "confidence_score": 0.96,
            "channel": "WhatsApp"
        }

    # Policy 2: Price Sensitive High Value Cart -> Targeted Margin-Bounded Coupon
    if intent == "Price Sensitive":
        discount_percent = 10 if cart_value > 10000 else 5
        estimated_margin_cost = cart_value * (discount_percent / 100.0)
        return {
            "action": "Offer Coupon",
            "reason": f"High cart value (₹{cart_value:,.2f}) with price hesitation. Trigger bounded {discount_percent}% instant coupon.",
            "expected_impact": f"Recovers ₹{cart_value - estimated_margin_cost:,.2f} net GMV post-discount cost of ₹{estimated_margin_cost:,.2f}.",
            "confidence_score": 0.89,
            "channel": "In-App Nudge"
        }

    # Policy 3: Delivery Concern -> Free Express Shipping Nudge
    if intent == "Delivery Concern":
        return {
            "action": "Free Shipping",
            "reason": "Hesitation observed at checkout delivery step. Waive shipping fee to eliminate final conversion friction.",
            "expected_impact": "Unlocks checkout completion with minimal cost (approx ₹99 delivery subsidy).",
            "confidence_score": 0.87,
            "channel": "In-App Banner"
        }

    # Policy 4: Buy Later -> Structured Email Reminder
    if intent == "Buy Later":
        return {
            "action": "Reminder Email",
            "reason": "Saved session behavior detected. Send gentle cart summary email with reserved item timer.",
            "expected_impact": "Drives return visit within 24-48 hours with 42% re-engagement rate.",
            "confidence_score": 0.82,
            "channel": "Email"
        }

    # Policy 5: Window Shopper -> Low Cost Retargeting or Do Nothing
    if intent == "Window Shopper":
        if cart_value < 1000:
            return {
                "action": "Do Nothing",
                "reason": "Low engagement window shopper with low cart value. Disincentivize expensive automated nudges.",
                "expected_impact": "Saves operational SMS/Email dispatch costs on unpromising sessions.",
                "confidence_score": 0.91,
                "channel": "None"
            }
        else:
            return {
                "action": "SMS",
                "reason": "Low engagement session with moderate cart value. Low-cost retargeting SMS reminder.",
                "expected_impact": "15% secondary revisit lift at minimal dispatch cost.",
                "confidence_score": 0.75,
                "channel": "SMS"
            }

    # Default High Risk Recovery Policy
    return {
        "action": "WhatsApp",
        "reason": "Generic high risk session. Trigger conversational WhatsApp cart recovery assistant.",
        "expected_impact": "Recovers up to 35% of abandoned carts via direct messaging.",
        "confidence_score": 0.80,
        "channel": "WhatsApp"
    }
