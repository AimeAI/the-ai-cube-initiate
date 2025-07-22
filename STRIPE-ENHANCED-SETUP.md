# Stripe Configuration for Enhanced Pricing

## Products to Create in Stripe Dashboard

1. **AI Cube Explorer**
   - Product ID: prod_explorer
   - Monthly Price: $8.00 (price_explorer_monthly)
   - Yearly Price: $64.00 (price_explorer_yearly)

2. **AI Cube Initiate** 
   - Product ID: prod_initiate
   - Monthly Price: $15.00 (price_initiate_monthly)
   - Yearly Price: $120.00 (price_initiate_yearly)

3. **AI Cube Master**
   - Product ID: prod_master
   - Monthly Price: $25.00 (price_master_monthly)
   - Yearly Price: $200.00 (price_master_yearly)

4. **AI Cube Family**
   - Product ID: prod_family
   - Monthly Price: $20.00 (price_family_monthly)
   - Yearly Price: $160.00 (price_family_yearly)

## Webhook Configuration

Endpoint: https://yourdomain.com/api/stripe-webhook
Events to listen for:
- checkout.session.completed
- invoice.payment_succeeded
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted

## Testing

Use Stripe CLI to test webhooks locally:
```bash
stripe listen --forward-to localhost:8080/api/stripe-webhook
```
