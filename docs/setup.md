# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/iwt_chat"

# Authentication
AUTH_SECRET="your-auth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Redis
REDIS_URL="redis://localhost:6379"

# App Configuration
NEXT_PUBLIC_ROOT_DOMAIN="localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Database Setup

1. **Install PostgreSQL** locally or use a cloud service
2. **Create a database** named `iwt_chat`
3. **Run migrations**:
   ```bash
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```

## Redis Setup

1. **Install Redis** locally or use Upstash
2. **Configure connection** in environment variables
3. **Test connection** by running the app

## Stripe Configuration

1. **Create a Stripe account** at https://stripe.com
2. **Get API keys** from the dashboard
3. **Set up webhooks**:
   - Endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
4. **Create products** in Stripe dashboard (optional - the seed script will create them)

## Google OAuth (Optional)

1. **Go to Google Cloud Console**
2. **Create a project** and enable Google+ API
3. **Create OAuth credentials**
4. **Add authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## Development

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start development server**:
   ```bash
   pnpm dev
   ```

3. **Access the application**:
   - Main site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Tenant subdomains: http://[tenant-name].localhost:3000

## Production Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - migrations will run automatically

### Other Platforms

1. **Set up PostgreSQL** and Redis
2. **Configure environment variables**
3. **Run build commands**:
   ```bash
   pnpm build
   pnpm start
   ```

## Troubleshooting

### Database Connection Issues
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify database exists

### Redis Connection Issues
- Check REDIS_URL format
- Ensure Redis is running
- Test connection manually

### Stripe Webhook Issues
- Verify webhook endpoint URL
- Check webhook signature
- Ensure events are configured correctly

### Subdomain Issues
- Check NEXT_PUBLIC_ROOT_DOMAIN
- Verify DNS configuration
- Test with localhost subdomains first
