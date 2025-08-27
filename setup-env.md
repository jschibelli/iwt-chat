# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Auth
AUTH_SECRET="your-auth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Redis
REDIS_URL="redis://localhost:6379"

# App
NEXT_PUBLIC_ROOT_DOMAIN="localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (Get these from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# OpenAI (for chatbot functionality)
OPENAI_API_KEY="sk-your_openai_api_key_here"
```

## How to Get Stripe Keys

1. **Go to Stripe Dashboard**: https://dashboard.stripe.com/
2. **Navigate to Developers → API keys**
3. **Copy your keys**:
   - **Publishable key**: Starts with `pk_test_` or `pk_live_`
   - **Secret key**: Starts with `sk_test_` or `sk_live_`

## How to Set Up Stripe Webhooks

1. **In Stripe Dashboard**: Go to Developers → Webhooks
2. **Add endpoint**: `http://localhost:3000/api/stripe/webhook`
3. **Select events**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. **Copy webhook secret**: Add it to `STRIPE_WEBHOOK_SECRET`

## Testing the Setup

After adding your environment variables, run:

```bash
# Test Stripe connection
node test-stripe.js

# Test the build
npm run build

# Start development server
npm run dev
```

## Troubleshooting

### Stripe Connection Issues
- Make sure you're using test keys for development
- Verify the keys are copied correctly (no extra spaces)
- Check that your Stripe account is active

### Build Issues
- Ensure all environment variables are set
- Check for TypeScript errors
- Verify all dependencies are installed

### Database Issues
- Run `pnpm db:push` to sync schema
- Run `pnpm db:seed` to populate initial data
- Check database connection string
