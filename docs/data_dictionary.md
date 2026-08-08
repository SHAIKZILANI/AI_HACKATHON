# CartRescue AI – Data Dictionary & Dataset Schema Specifications

This document outlines the core raw datasets used for feature engineering and training the XGBoost cart abandonment prediction model.

---

## 1. `customers.csv`
| Column | Type | Description |
| :--- | :--- | :--- |
| `customer_id` | Integer (PK) | Unique customer identifier |
| `first_name` | String | Customer first name |
| `last_name` | String | Customer last name |
| `email` | String | Unique email address |
| `phone` | String | Contact phone number |
| `segment` | Enum | Customer segment (`VIP`, `HIGH_VALUE`, `STANDARD`, `PRICE_SENSITIVE`, `NEW`) |
| `total_orders` | Integer | Historical completed orders count |
| `total_spent` | Decimal | Total cumulative historical spend (₹) |
| `average_order_value` | Decimal | Historical Average Order Value (AOV) |
| `customer_lifetime_value` | Decimal | Calculated Customer Lifetime Value (CLV) |

---

## 2. `sessions.csv`
| Column | Type | Description |
| :--- | :--- | :--- |
| `session_id` | String (PK) | Unique clickstream session token |
| `customer_id` | Integer (FK) | Associated customer ID |
| `device_type` | Enum | Device type (`MOBILE`, `DESKTOP`, `TABLET`) |
| `operating_system` | String | Client OS (`Windows`, `Android`, `iOS`, `macOS`) |
| `session_duration_sec` | Integer | Total active duration of session in seconds |
| `cart_value` | Decimal | Total current value of cart items (₹) |
| `items_count` | Integer | Number of items currently in cart |
| `checkout_attempts` | Integer | Number of checkout page visits |
| `payment_failures` | Integer | Technical payment gateway drops count |
| `cart_revisit_count` | Integer | Number of times cart page was re-opened |
| `is_weekend` | Boolean (0/1) | Flag for weekend shopping pattern |
| `is_night` | Boolean (0/1) | Flag for late night shopping session |
| `is_abandoned` | Boolean (0/1) | **Target Ground Truth Label** (1 = Abandoned, 0 = Converted) |

---

## 3. Engineered Features (`FEATURE_COLUMNS`)
1. `session_duration_sec`: Session idle & exploration time.
2. `cart_value`: Total monetary value of items.
3. `items_count`: Quantity of items in cart.
4. `checkout_attempts`: Funnel progression attempts.
5. `payment_failures`: Technical payment gateway drop indicator.
6. `cart_revisit_count`: Hesitation / comparison metric.
7. `price_per_item`: `cart_value / items_count`
8. `cart_velocity`: `cart_value / (session_duration_sec + 1)`
9. `payment_failure_rate`: `payment_failures / (checkout_attempts + 1)`
10. `has_payment_issue`: Binary indicator for payment error.
11. `customer_clv`: Historical customer value weight.
