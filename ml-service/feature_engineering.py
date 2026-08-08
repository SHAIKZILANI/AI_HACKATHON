import pandas as pd
import numpy as np

FEATURE_COLUMNS = [
    'session_duration_sec',
    'cart_value',
    'items_count',
    'checkout_attempts',
    'payment_failures',
    'cart_revisit_count',
    'is_weekend',
    'is_night',
    'customer_total_orders',
    'customer_total_spent',
    'customer_aov',
    'customer_clv',
    'price_per_item',
    'cart_velocity',
    'payment_failure_rate',
    'has_payment_issue'
]

def engineer_features_from_df(df_sessions, df_customers):
    """
    Engineers high-dimensional behavioral signals from merged session and customer dataframes.
    """
    df = df_sessions.merge(df_customers, on='customer_id', how='left')

    # Fill missing customer metrics for guest shoppers
    df['total_orders'] = df['total_orders'].fillna(0)
    df['total_spent'] = df['total_spent'].fillna(0.0)
    df['average_order_value'] = df['average_order_value'].fillna(0.0)
    df['customer_lifetime_value'] = df['customer_lifetime_value'].fillna(0.0)

    # Calculate computed interaction features
    df['price_per_item'] = df['cart_value'] / np.maximum(df['items_count'], 1)
    df['cart_velocity'] = df['cart_value'] / (df['session_duration_sec'] + 1.0)
    df['payment_failure_rate'] = df['payment_failures'] / (df['checkout_attempts'] + 1.0)
    df['has_payment_issue'] = (df['payment_failures'] > 0).astype(int)

    # Rename customer columns to feature standard
    df['customer_total_orders'] = df['total_orders']
    df['customer_total_spent'] = df['total_spent']
    df['customer_aov'] = df['average_order_value']
    df['customer_clv'] = df['customer_lifetime_value']

    X = df[FEATURE_COLUMNS]
    y = df['is_abandoned'] if 'is_abandoned' in df.columns else None

    return X, y

def engineer_features_single(session_dict):
    """
    Engineers feature vector for a single real-time API session input payload.
    """
    items_count = max(int(session_dict.get('items_count', 1)), 1)
    cart_value = float(session_dict.get('cart_value', 0.0))
    duration = float(session_dict.get('session_duration_sec', 0.0))
    checkout_attempts = int(session_dict.get('checkout_attempts', 0))
    payment_failures = int(session_dict.get('payment_failures', 0))

    features = {
        'session_duration_sec': duration,
        'cart_value': cart_value,
        'items_count': items_count,
        'checkout_attempts': checkout_attempts,
        'payment_failures': payment_failures,
        'cart_revisit_count': int(session_dict.get('cart_revisit_count', 1)),
        'is_weekend': int(session_dict.get('is_weekend', 0)),
        'is_night': int(session_dict.get('is_night', 0)),
        'customer_total_orders': int(session_dict.get('customer_total_orders', 0)),
        'customer_total_spent': float(session_dict.get('customer_total_spent', 0.0)),
        'customer_aov': float(session_dict.get('customer_aov', 0.0)),
        'customer_clv': float(session_dict.get('customer_clv', 0.0)),
        'price_per_item': cart_value / items_count,
        'cart_velocity': cart_value / (duration + 1.0),
        'payment_failure_rate': payment_failures / (checkout_attempts + 1.0),
        'has_payment_issue': 1 if payment_failures > 0 else 0
    }

    df_single = pd.DataFrame([features])[FEATURE_COLUMNS]
    return df_single
