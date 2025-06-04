# Supabase Integration Domain Model

## 1. Introduction
This document defines the core entities, their attributes, and relationships for the Supabase integration.

## 2. Entities

### 2.1 User
- **Attributes:**
    - `id`: UUID (Primary Key, auto-generated)
    - `email`: TEXT (Unique, Required)
    - `password_hash`: TEXT (Required)
    - `created_at`: TIMESTAMP with time zone (default now())
    - `updated_at`: TIMESTAMP with time zone (default now())
    - `name`: TEXT (Optional)
    - `profile_picture_url`: TEXT (Optional)
- **Relationships:**
    - One-to-many with `user_subscriptions`

### 2.2 SubscriptionPlan
- **Attributes:**
    - `id`: UUID (Primary Key, auto-generated)
    - `name`: TEXT (Required)
    - `description`: TEXT (Optional)
    - `price`: NUMERIC (Required)
    - `interval`: TEXT (e.g., "month", "year", Required)
    - `created_at`: TIMESTAMP with time zone (default now())
    - `updated_at`: TIMESTAMP with time zone (default now())
- **Relationships:**
    - One-to-many with `user_subscriptions`

### 2.3 UserSubscription
- **Attributes:**
    - `id`: UUID (Primary Key, auto-generated)
    - `user_id`: UUID (Foreign Key referencing `User.id`, Required)
    - `plan_id`: UUID (Foreign Key referencing `SubscriptionPlan.id`, Required)
    - `start_date`: TIMESTAMP with time zone (Required)
    - `end_date`: TIMESTAMP with time zone (Optional)
    - `created_at`: TIMESTAMP with time zone (default now())
    - `updated_at`: TIMESTAMP with time zone (default now())
- **Relationships:**
    - Many-to-one with `User`
    - Many-to-one with `SubscriptionPlan`

## 3. Data Structures (Example - TypeScript)

```typescript
// User
interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
  name?: string;
  profile_picture_url?: string;
}

// SubscriptionPlan
interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  interval: string;
  created_at: string;
  updated_at: string;
}

// UserSubscription
interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}
```

## 4. Database Schema (SQL)

```sql
-- users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  profile_picture_url TEXT
);

-- subscription_plans table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  interval TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_subscriptions table
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions (user_id);
CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions (plan_id);