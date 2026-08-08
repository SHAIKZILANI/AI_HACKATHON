import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_datasets():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(data_dir, exist_ok=True)

    np.random.seed(42)
    random.seed(42)

    num_customers = 500
    num_products = 50
    num_sessions = 2000

    # 1. Generate Customers CSV
    first_names = ["Rajesh", "Priya", "Aarav", "Ananya", "Vikram", "Neha", "Rohan", "Sanya", "Karan", "Meera"]
    last_names = ["Kumar", "Sharma", "Patel", "Deshmukh", "Singh", "Verma", "Joshi", "Gupta", "Nair", "Reddy"]
    segments = ["VIP", "HIGH_VALUE", "STANDARD", "PRICE_SENSITIVE", "NEW"]
    
    customers_data = []
    for c_id in range(1, num_customers + 1):
        fn = random.choice(first_names)
        ln = random.choice(last_names)
        email = f"{fn.lower()}.{ln.lower()}{c_id}@example.in"
        phone = f"+9198{random.randint(10000000, 99999999)}"
        segment = random.choice(segments)
        tot_orders = random.randint(0, 15) if segment != "NEW" else 0
        avg_aov = float(np.random.uniform(500, 8000)) if tot_orders > 0 else 0.0
        tot_spent = float(tot_orders * avg_aov)
        clv = float(tot_spent * np.random.uniform(1.2, 2.5) + np.random.uniform(1000, 5000))
        created_at = (datetime.now() - timedelta(days=random.randint(30, 365))).strftime("%Y-%m-%d %H:%M:%S")

        customers_data.append({
            "customer_id": c_id,
            "first_name": fn,
            "last_name": ln,
            "email": email,
            "phone": phone,
            "segment": segment,
            "total_orders": tot_orders,
            "total_spent": round(tot_spent, 2),
            "average_order_value": round(avg_aov, 2),
            "customer_lifetime_value": round(clv, 2),
            "created_at": created_at
        })
    df_customers = pd.DataFrame(customers_data)
    df_customers.to_csv(os.path.join(data_dir, "customers.csv"), index=False)

    # 2. Generate Products CSV
    categories = ["Electronics", "Footwear", "Apparel", "Home Appliances", "Beauty"]
    products_data = []
    for p_id in range(1, num_products + 1):
        cat = random.choice(categories)
        sku = f"{cat[:4].upper()}-{p_id:03d}"
        name = f"Premium {cat[:-1]} Product {p_id}"
        price = float(np.random.uniform(299, 35000))
        stock = random.randint(10, 200)
        rating = round(float(np.random.uniform(3.5, 5.0)), 2)

        products_data.append({
            "product_id": p_id,
            "sku": sku,
            "name": name,
            "category": cat,
            "price": round(price, 2),
            "stock_quantity": stock,
            "rating_avg": rating
        })
    df_products = pd.DataFrame(products_data)
    df_products.to_csv(os.path.join(data_dir, "products.csv"), index=False)

    # 3. Generate Sessions CSV & Events CSV
    sessions_data = []
    events_data = []
    event_id_counter = 1

    devices = ["MOBILE", "DESKTOP", "TABLET"]
    os_list = ["Android", "iOS", "Windows", "macOS"]

    for s_idx in range(1, num_sessions + 1):
        s_id = f"sess_{s_idx:06d}"
        c_id = random.randint(1, num_customers)
        device = random.choice(devices)
        op_sys = random.choice(os_list)
        ip = f"103.{random.randint(10, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"
        
        start_time = datetime.now() - timedelta(days=random.randint(0, 30), minutes=random.randint(0, 1440))
        is_weekend = int(start_time.weekday() >= 5)
        is_night = int(start_time.hour < 6 or start_time.hour > 22)
        
        # Determine intent profile
        intent_type = np.random.choice(
            ["BUY_NOW", "PAYMENT_ISSUE", "PRICE_SENSITIVE", "WINDOW_SHOPPER", "HIGH_RISK_ABANDON"],
            p=[0.35, 0.15, 0.20, 0.15, 0.15]
        )

        if intent_type == "BUY_NOW":
            checkout_attempts = random.choice([1, 2])
            payment_failures = 0
            is_abandoned = 0
            duration = random.randint(300, 900)
            revisits = random.randint(1, 2)
        elif intent_type == "PAYMENT_ISSUE":
            checkout_attempts = random.randint(2, 4)
            payment_failures = random.randint(1, 3)
            is_abandoned = 1
            duration = random.randint(600, 1800)
            revisits = random.randint(2, 5)
        elif intent_type == "PRICE_SENSITIVE":
            checkout_attempts = 1
            payment_failures = 0
            is_abandoned = 1
            duration = random.randint(400, 1200)
            revisits = random.randint(3, 6)
        else: # WINDOW_SHOPPER or HIGH_RISK_ABANDON
            checkout_attempts = 0
            payment_failures = 0
            is_abandoned = 1
            duration = random.randint(120, 600)
            revisits = random.randint(1, 3)

        num_items = random.randint(1, 4)
        selected_prods = random.sample(range(1, num_products + 1), num_items)
        cart_val = sum([df_products.loc[df_products['product_id'] == pid, 'price'].values[0] for pid in selected_prods])

        end_time = start_time + timedelta(seconds=duration)
        status = "CONVERTED" if is_abandoned == 0 else ("PAYMENT_FAILED" if payment_failures > 0 else "ABANDONED")

        sessions_data.append({
            "session_id": s_id,
            "customer_id": c_id,
            "device_type": device,
            "operating_system": op_sys,
            "ip_address": ip,
            "start_time": start_time.strftime("%Y-%m-%d %H:%M:%S"),
            "end_time": end_time.strftime("%Y-%m-%d %H:%M:%S"),
            "is_weekend": is_weekend,
            "is_night": is_night,
            "session_duration_sec": duration,
            "cart_value": round(cart_val, 2),
            "items_count": num_items,
            "checkout_attempts": checkout_attempts,
            "payment_failures": payment_failures,
            "cart_revisit_count": revisits,
            "is_abandoned": is_abandoned,
            "status": status
        })

        # Add corresponding events
        curr_time = start_time
        for pid in selected_prods:
            p_price = df_products.loc[df_products['product_id'] == pid, 'price'].values[0]
            events_data.append({
                "event_id": event_id_counter,
                "session_id": s_id,
                "event_type": "PRODUCT_VIEW",
                "product_id": pid,
                "event_time": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
                "item_price": p_price
            })
            event_id_counter += 1
            curr_time += timedelta(seconds=random.randint(10, 60))

            events_data.append({
                "event_id": event_id_counter,
                "session_id": s_id,
                "event_type": "ADD_TO_CART",
                "product_id": pid,
                "event_time": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
                "item_price": p_price
            })
            event_id_counter += 1
            curr_time += timedelta(seconds=random.randint(20, 100))

        if checkout_attempts > 0:
            events_data.append({
                "event_id": event_id_counter,
                "session_id": s_id,
                "event_type": "CHECKOUT_START",
                "product_id": selected_prods[0],
                "event_time": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
                "item_price": cart_val
            })
            event_id_counter += 1

        for pf in range(payment_failures):
            curr_time += timedelta(seconds=random.randint(30, 90))
            events_data.append({
                "event_id": event_id_counter,
                "session_id": s_id,
                "event_type": "PAYMENT_FAILURE",
                "product_id": selected_prods[0],
                "event_time": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
                "item_price": cart_val
            })
            event_id_counter += 1

    df_sessions = pd.DataFrame(sessions_data)
    df_sessions.to_csv(os.path.join(data_dir, "sessions.csv"), index=False)

    df_events = pd.DataFrame(events_data)
    df_events.to_csv(os.path.join(data_dir, "events.csv"), index=False)

    # 4. Generate Orders & Order Items CSV
    orders_data = []
    order_items_data = []
    o_id = 1
    oi_id = 1

    converted_sessions = df_sessions[df_sessions['is_abandoned'] == 0]
    for _, s_row in converted_sessions.iterrows():
        orders_data.append({
            "order_id": o_id,
            "session_id": s_row['session_id'],
            "customer_id": s_row['customer_id'],
            "total_amount": s_row['cart_value'],
            "discount_amount": 0.00,
            "payment_method": random.choice(["UPI", "CREDIT_CARD", "NET_BANKING", "COD"]),
            "status": "COMPLETED",
            "created_at": s_row['end_time']
        })

        # Find events for this session
        s_events = df_events[(df_events['session_id'] == s_row['session_id']) & (df_events['event_type'] == 'ADD_TO_CART')]
        for _, e_row in s_events.iterrows():
            order_items_data.append({
                "order_item_id": oi_id,
                "order_id": o_id,
                "product_id": e_row['product_id'],
                "quantity": 1,
                "unit_price": e_row['item_price']
            })
            oi_id += 1
        o_id += 1

    pd.DataFrame(orders_data).to_csv(os.path.join(data_dir, "orders.csv"), index=False)
    pd.DataFrame(order_items_data).to_csv(os.path.join(data_dir, "order_items.csv"), index=False)

    # 5. Generate Reviews CSV
    reviews_data = []
    for r_id in range(1, 300):
        reviews_data.append({
            "review_id": r_id,
            "product_id": random.randint(1, num_products),
            "customer_id": random.randint(1, num_customers),
            "rating": random.choice([3, 4, 5, 5, 4, 2, 1]),
            "review_text": "Great product quality, delivered on time!",
            "created_at": (datetime.now() - timedelta(days=random.randint(1, 100))).strftime("%Y-%m-%d %H:%M:%S")
        })
    pd.DataFrame(reviews_data).to_csv(os.path.join(data_dir, "reviews.csv"), index=False)

    print(f"Successfully generated dataset files in {data_dir}")

if __name__ == "__main__":
    generate_datasets()
