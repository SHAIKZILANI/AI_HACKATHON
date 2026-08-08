-- CartRescue AI Enterprise Database Seed Script
USE cartrescue_db;

-- 1. Insert Initial System Users (Passwords are BCrypt encrypted for "admin123" and "analyst123")
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
('admin', 'admin@cartrescue.ai', '$2a$10$e7v1g5gBfK.r4VvRkX1Y6u.F0s1N/mFzMvD4s4pG5q5W5v5Y5u5K2', 'System Administrator', 'ROLE_ADMIN'),
('analyst', 'analyst@cartrescue.ai', '$2a$10$e7v1g5gBfK.r4VvRkX1Y6u.F0s1N/mFzMvD4s4pG5q5W5v5Y5u5K2', 'Lead E-Commerce Analyst', 'ROLE_ANALYST');

-- 2. Insert Core Customers
INSERT INTO customers (first_name, last_name, email, phone, segment, total_orders, total_spent, average_order_value, customer_lifetime_value) VALUES
('Rajesh', 'Kumar', 'rajesh.kumar@example.in', '+919876543210', 'VIP', 12, 48500.00, 4041.67, 85000.00),
('Priya', 'Sharma', 'priya.sharma@example.in', '+919876543211', 'HIGH_VALUE', 7, 24300.00, 3471.43, 42000.00),
('Aarav', 'Patel', 'aarav.patel@example.in', '+919876543212', 'STANDARD', 2, 4500.00, 2250.00, 12000.00),
('Ananya', 'Deshmukh', 'ananya.d@example.in', '+919876543213', 'PRICE_SENSITIVE', 1, 1200.00, 1200.00, 5000.00),
('Vikram', 'Singh', 'vikram.singh@example.in', '+919876543214', 'NEW', 0, 0.00, 0.00, 2500.00);

-- 3. Insert Core Products Catalog
INSERT INTO products (sku, name, category, price, stock_quantity, rating_avg) VALUES
('ELEC-AUDIO-001', 'Sony WH-1000XM5 Wireless Headphones', 'Electronics', 29990.00, 45, 4.80),
('ELEC-SMART-002', 'Apple Watch Series 9 GPS 45mm', 'Electronics', 41900.00, 20, 4.75),
('FOOT-SNEAK-003', 'Nike Air Max 270 Premium', 'Footwear', 12995.00, 80, 4.60),
('APPAR-HOOD-004', 'Puma Classic Fleece Hoodie', 'Apparel', 3499.00, 150, 4.40),
('HOME-COFF-005', 'Nespresso Vertuo Pop Coffee Machine', 'Home Appliances', 14999.00, 30, 4.65);

-- 4. Insert Sample Active & Past Sessions
INSERT INTO sessions (session_id, customer_id, device_type, operating_system, ip_address, start_time, end_time, is_weekend, is_night, session_duration_sec, cart_value, items_count, checkout_attempts, payment_failures, cart_revisit_count, is_abandoned, status) VALUES
('sess_982341_live', 1, 'MOBILE', 'Android', '103.21.12.45', NOW() - INTERVAL 15 MINUTE, NULL, FALSE, FALSE, 900, 29990.00, 1, 2, 2, 3, TRUE, 'HIGH_RISK_ABANDON'),
('sess_881234_live', 2, 'DESKTOP', 'Windows', '49.207.180.12', NOW() - INTERVAL 8 MINUTE, NULL, FALSE, FALSE, 480, 12995.00, 1, 0, 0, 1, FALSE, 'ACTIVE'),
('sess_771239_hist', 3, 'MOBILE', 'iOS', '152.57.22.90', NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 1 HOUR, TRUE, TRUE, 1800, 41900.00, 1, 1, 0, 4, TRUE, 'ABANDONED'),
('sess_661298_hist', 4, 'DESKTOP', 'macOS', '103.102.44.11', NOW() - INTERVAL 5 HOUR, NOW() - INTERVAL 4 HOUR, FALSE, FALSE, 1200, 3499.00, 1, 0, 0, 2, FALSE, 'CONVERTED');

-- 5. Insert Sample Events
INSERT INTO events (session_id, event_type, product_id, event_time, item_price) VALUES
('sess_982341_live', 'PAGE_VIEW', 1, NOW() - INTERVAL 15 MINUTE, 29990.00),
('sess_982341_live', 'ADD_TO_CART', 1, NOW() - INTERVAL 12 MINUTE, 29990.00),
('sess_982341_live', 'CHECKOUT_START', 1, NOW() - INTERVAL 8 MINUTE, 29990.00),
('sess_982341_live', 'PAYMENT_ATTEMPT', 1, NOW() - INTERVAL 6 MINUTE, 29990.00),
('sess_982341_live', 'PAYMENT_FAILURE', 1, NOW() - INTERVAL 5 MINUTE, 29990.00),
('sess_982341_live', 'PAYMENT_ATTEMPT', 1, NOW() - INTERVAL 3 MINUTE, 29990.00),
('sess_982341_live', 'PAYMENT_FAILURE', 1, NOW() - INTERVAL 2 MINUTE, 29990.00);

-- 6. Insert Sample Predictions
INSERT INTO predictions (session_id, abandonment_risk_score, intent_category, recommended_action, confidence_score, top_features_json, human_reason, expected_impact) VALUES
('sess_982341_live', 0.9420, 'Payment Issue', 'Retry Payment', 0.9650, 
 '{"payment_failures": 2, "checkout_attempts": 2, "cart_value": 29990.00, "session_duration_sec": 900}',
 'Shopper encountered 2 payment gateway failures during checkout for cart worth ₹29,990. High probability of abandonment due to technical gateway drop.',
 'High potential conversion recovery (92%) by routing via alternate UPI/card link or automated WhatsApp payment retry prompt.');

-- 7. Insert Sample Recovery Action Audit Log
INSERT INTO recovery_actions (session_id, action_type, channel, recipient, status, payload_json, estimated_margin_impact) VALUES
('sess_982341_live', 'Retry Payment', 'WhatsApp', '+919876543210', 'SENT',
 '{"template": "upi_retry_nudge", "cart_id": "sess_982341_live", "link": "https://cartrescue.ai/pay/retry/982341"}',
 2999.00);
