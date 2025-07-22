# 🗄️ Supabase Setup Guide for AI Cube Initiate

## 📋 Current Status
✅ **Supabase Project**: Connected and accessible  
⚠️ **Database Tables**: Missing - need to be created  
⚠️ **Demo User**: Not created yet  
❌ **Service Role Key**: Not configured  

---

## 🚀 Step-by-Step Setup

### Step 1: Access Your Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Find your project: **jtnmrxgdtjupfvaoddif**
3. If the project is paused, click **"Resume Project"**

### Step 2: Create Database Tables
1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy and paste** the entire contents of `supabase-setup.sql`
3. **Click "Run"** to execute the migration
4. **Verify success** - you should see tables created without errors

### Step 3: Get Service Role Key
1. **Go to Settings > API** in your Supabase dashboard
2. **Copy the `service_role` key** (keep this secret!)
3. **Update `.env.server`**:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
   ```

### Step 4: Create Demo User
1. **Go to Authentication > Users** in Supabase dashboard
2. **Click "Add User"**
3. **Enter:**
   - Email: `demo@aicube.ai`
   - Password: `Demo123!`
   - Auto Confirm User: ✅ **Check this box**
4. **Click "Create User"**

### Step 5: Test the Connection
Run the test script to verify everything works:
```bash
npm run test:supabase
```

---

## 🔧 Environment Configuration

### Required Environment Variables

#### `.env` (Client-side - already configured ✅)
```bash
VITE_SUPABASE_URL=https://jtnmrxgdtjupfvaoddif.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51RQkkXIX0sVsreTx0KxCZxc6hsKIcW03OPdIBnVzWxaTk5hQGJO9FAtnzZaW3K2wZpnJOSZ27B8BLpT9T4jH8syH00JbZosTuF
```

#### `.env.server` (Server-side - needs configuration ⚠️)
```bash
# Get this from Supabase Dashboard > Settings > API
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Get these from Stripe Dashboard
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SIGNING_SECRET=your_webhook_secret_here

# Generate a random 32-character string
SESSION_SECRET=your_random_32_char_session_secret

NODE_ENV=development
```

---

## 🧪 Testing Your Setup

### Test 1: Basic Connection
```bash
node scripts/test-connection.mjs
```
**Expected Result:** ✅ Connection successful

### Test 2: User Authentication
1. Go to `http://localhost:8080/login`
2. Try logging in with: `demo@aicube.ai` / `Demo123!`
3. Should redirect to payment page (no subscription yet)

### Test 3: Database Queries
```bash
npm run dev
```
Navigate to the parent dashboard - should load without database errors.

---

## 🗄️ Database Schema Overview

### Tables Created:
- **`user_subscriptions`**: Manages Stripe subscriptions and plan tiers
- **`user_profiles`**: User profile information and account types

### Functions Created:
- **`get_user_plan_tier(uuid)`**: Returns user's current subscription tier
- **`user_has_feature_access(uuid, text)`**: Checks feature access by tier

### Security:
- **Row Level Security (RLS)** enabled on all tables
- **Policies** restrict access to user's own data
- **Service role** can manage all data (for webhooks)

---

## 🎯 Subscription Tiers

| Tier | Price | Games Access | Features |
|------|-------|--------------|----------|
| **Explorer** | $7.99/mo | 5 games | Basic tracking, Email support |
| **Initiate** | $14.99/mo | All games | Advanced tracking, Parent dashboard |
| **Master** | $24.99/mo | All games | Tutoring, Analytics, Early access |
| **Family** | $19.99/mo | All games | 4 accounts, Family dashboard |

---

## 🚨 Troubleshooting

### Issue: "relation does not exist"
**Solution:** Run the SQL migration in Supabase SQL Editor

### Issue: "JWT expired" or "Invalid token"
**Solution:** 
1. Check if project is paused in Supabase
2. Verify environment variables are correct
3. Try refreshing the anon key

### Issue: Demo user login fails
**Solution:**
1. Verify user exists in Authentication > Users
2. Make sure "Email Confirmed" is checked
3. Try resetting the password

### Issue: Payment flow fails
**Solution:**
1. Configure Stripe keys in `.env.server`
2. Set up webhook endpoints
3. Test with Stripe test cards

---

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Review Supabase logs in the dashboard
3. Verify all environment variables are set
4. Test the connection with the provided scripts

---

## ✅ Launch Checklist

- [ ] Supabase project resumed and accessible
- [ ] Database tables created via SQL migration
- [ ] Service role key configured in `.env.server`
- [ ] Demo user created and confirmed
- [ ] Connection test passes
- [ ] Login flow works with demo user
- [ ] Payment page loads without errors
- [ ] Stripe keys configured (for payment testing)

**Once all items are checked, your AI Cube platform will be fully operational!** 🚀
