# Multi-Tenant Chatbot SaaS Platform

A production-ready, multi-tenant chatbot platform built with Next.js 15, TypeScript, and modern web technologies. This platform allows businesses to create, customize, and deploy AI chatbots with their own branding and subdomain.

## 🚀 Features

- **Multi-Tenant Architecture**: Isolated data per client with custom subdomains
- **Custom Branding**: Full control over colors, fonts, logos, and themes
- **Subscription Management**: Stripe integration with multiple pricing tiers
- **Usage Metering**: Real-time tracking of API calls and token usage
- **Feature Flags**: Plan-based feature gating and access control
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Authentication**: NextAuth.js with email/password and OAuth support

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL with Prisma
- **Authentication**: NextAuth.js with Prisma adapter
- **Payments**: Stripe for subscriptions and billing
- **Caching**: Redis (Upstash) for usage tracking
- **Styling**: Tailwind CSS with shadcn/ui components
- **Validation**: Zod for schema validation

### Multi-Tenancy Model
- **Subdomain-based**: Each tenant gets `{tenant}.domain.com`
- **Data Isolation**: All database queries filtered by `tenantId`
- **Edge Middleware**: Automatic subdomain routing and tenant resolution
- **Role-based Access**: Owner, Admin, Editor, Viewer roles

## 📋 Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Redis instance (Upstash recommended)
- Stripe account for payments
- Google OAuth credentials (optional)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd iwt-chat
pnpm install
```

### 2. Environment Configuration

Create a `.env.local` file with the following variables:

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

### 3. Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed the database with plans
pnpm db:seed
```

### 4. Stripe Configuration

1. Create products and prices in your Stripe dashboard
2. Set up webhook endpoints pointing to `/api/stripe/webhook`
3. Configure the webhook to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

### 5. Development

```bash
# Start development server
pnpm dev

# Open Prisma Studio (optional)
pnpm db:studio
```

## 🏃‍♂️ Quick Start

### 1. Sign Up
- Visit `http://localhost:3000`
- Click "Start Free Trial"
- Complete the signup form

### 2. Onboarding
- Create your organization
- Customize branding
- Configure chatbot settings
- Choose a subscription plan

### 3. Embed Chatbot
- Get your embed code from the dashboard
- Add the script to your website
- Start chatting!

## 📁 Project Structure

```
/app
  /(marketing)          # Marketing pages (landing, pricing)
  /(app)               # Protected app routes
    /dashboard         # Main dashboard
    /s/[subdomain]     # Tenant-specific pages
    /onboarding        # Setup wizard
    /settings          # Configuration pages
  /api                 # API routes
    /auth              # Authentication endpoints
    /stripe            # Payment processing
    /chat              # Chatbot API
/components
  /ui                  # shadcn/ui components
  /chatbot             # Chat widget components
/lib
  /prisma.ts          # Database client
  /auth.ts            # Auth configuration
  /tenancy.ts         # Multi-tenant utilities
  /stripe.ts          # Payment integration
  /usage.ts           # Usage tracking
  /plans.ts           # Subscription plans
/prisma
  /schema.prisma      # Database schema
  /seed.ts           # Database seeding
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js routes

### Chatbot
- `POST /api/chat` - Process chat messages
- `GET /api/chatbot/config` - Get chatbot configuration

### Billing
- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe events

## 🎨 Customization

### Branding
The platform supports full branding customization:
- Primary/secondary colors
- Custom fonts
- Logo and favicon upload
- Dark/light mode toggle

### Chatbot Configuration
- AI model selection
- Temperature and response settings
- System prompts
- Allowed origins for embedding

## 🔒 Security Features

- **Row-level Security**: All data queries filtered by tenant
- **API Key Authentication**: Secure chatbot API access
- **Rate Limiting**: Per-tenant and per-IP limits
- **Input Validation**: Zod schemas for all inputs
- **CORS Protection**: Origin validation for embeds

## 📊 Usage Tracking

The platform tracks:
- Token usage per conversation
- API call frequency
- Monthly conversation counts
- Plan limit enforcement

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables
3. Deploy with automatic database migrations

### Other Platforms
- Ensure PostgreSQL and Redis are available
- Set up environment variables
- Run `pnpm build` and `pnpm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in `/docs`
- Open an issue on GitHub
- Contact the development team

## 🎯 Roadmap

- [ ] Advanced AI model integration
- [ ] Conversation analytics dashboard
- [ ] Team collaboration features
- [ ] API rate limiting improvements
- [ ] Mobile app support
- [ ] Enterprise SSO integration
