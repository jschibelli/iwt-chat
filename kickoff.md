# Cursor Superprompt: Build the Multi‑Tenant Chatbot SaaS (Auth → Onboarding → Branding → Billing)

You are Cursor coding agent for a production‑grade, multi‑tenant chatbot platform based on our existing Next.js Platform Starter foundation. Implement end‑to‑end: marketing site, signup/auth, tenant provisioning, dashboard, per‑tenant branding, feature gating, Stripe subscriptions, usage metering, and case‑study‑ready documentation.

---

## Non‑Negotiables

* **Tech**: Next.js 15 (App Router), TypeScript, React, Edge Middleware for subdomain routing, Prisma + Postgres, Auth.js (NextAuth) with email/password + OAuth, Stripe Billing + Customer Portal, Redis (Upstash) for cache/rate limits, Zod, TanStack Query, shadcn/ui + Tailwind.
* **Tenancy**: subdomain = `{tenant}.domain.com` with wildcard DNS. All data isolated via `tenantId` guard in server and client boundaries.
* **DX**: Clean code, exhaustive types, ESLint/Prettier, Vitest/Playwright smoke tests, CI checks. No mock data in product paths.
* **Docs**: Ship full /docs with architecture diagrams, ADRs, and an onboarding runbook we can publish as a case study.

---

## High‑Level Flow (first run)

1. **Marketing** → CTA → **Sign up**
2. **Auth** (create user) → email verify (magic link) → first login
3. **Tenant provisioning** (org/tenant record, subdomain)
4. **Onboarding wizard** in dashboard: Company → Branding → Chatbot Setup → Features → Billing → Install → Invite team
5. **Stripe checkout** (trial on Basic) → enforce feature gates → Customer Portal
6. **Use**: embed widget on client site; monitor usage/limits

---

## File/Folder Structure (create & refactor)

```
/app
  /(marketing)
    page.tsx
    pricing/page.tsx
    components/*
  /(app)
    dashboard/page.tsx
    onboarding/*   // multi‑step wizard
    settings/*     // branding, billing, features
    chatbot/*      // dataset, prompts, keys, install
    usage/*        // metering & logs
  /api
    /auth/[...nextauth]/route.ts
    /tenants/*
    /branding/*
    /features/*
    /stripe/*
    /chatbot/*
/components
  ui/* (shadcn)
  forms/*
  tenant/* (TenantGuard, TenantSwitcher, Breadcrumb)
  branding/* (ThemePicker, LogoUploader, LivePreview)
  chatbot/* (InstallSnippet, PromptEditor)
  billing/* (PlanCards, CheckoutButton, PortalButton)
/lib
  auth.ts
  stripe.ts
  prisma.ts
  cache.ts
  tenancy.ts (getTenantByHost, requireTenant)
  featureFlags.ts
  plans.ts
  usage.ts
  logger.ts
/prisma
  schema.prisma
/scripts
  seed.ts
  fix‑wildcard.ts (optional helper)
/tests
  e2e/* (playwright)
  unit/* (vitest)
/docs
  architecture.md
  onboarding-flow.md
  tenancy.md
  billing.md
  chatbot.md
  security.md
  operations.md
  case-study.md
  adr/0001-tenancy-model.md
  adr/0002-billing-tiers.md
  adr/0003-branding-theme-model.md
```

---

## Database Schema (Prisma)

Create/extend the following models with indices and FKs:

* **User** (Auth.js standard), **Account**, **Session**
* **Tenant** { id, slug, name, ownerId, createdAt }
* **Membership** { id, userId, tenantId, role: enum(OWNER|ADMIN|EDITOR|VIEWER) }
* **BrandingTheme** { id, tenantId, primary, secondary, accent, surface, text, logoUrl, faviconUrl, font, darkMode }
* **Plan** { id, key: enum(FREE|BASIC|PRO|ENTERPRISE), label, priceMonthly, priceYearly, features JSON, limits JSON }
* **Subscription** { id, tenantId, planId, stripeCustomerId, stripeSubId, status, trialEndsAt, cancelAt }
* **FeatureFlag** { id, tenantId, key, enabled, value JSON }
* **ChatbotConfig** { id, tenantId, model, temperature, systemPrompt, allowedOrigins JSON, widgetOptions JSON }
* **ApiKey** { id, tenantId, name, hash, lastUsedAt }
* **UsageEvent** { id, tenantId, type, quantity, metadata JSON, createdAt }

Guard rails: every read/write constrained by `tenantId`. Add composite indexes `{tenantId, ...}` for hot paths.

---

## Auth & Tenant Resolution

* Implement Auth.js credentials + optional OAuth (Google).
* On login, if user has multiple tenants, show TenantSwitcher; else redirect to their only tenant dashboard.
* **Edge middleware**: parse host, map to `tenant.slug`; for root domain show marketing; for unknown tenant show 404/claim flow.
* **TenantGuard** component on server routes and RPC.

---

## Onboarding Wizard (multi‑step)

Implement as server actions + Zod forms, persistent draft state per tenant.
Steps:

1. **Company Info**: company name, industry, website, timezone, support email; create `Tenant`, add owner `Membership`.
2. **Branding**: pick base palette, upload logo/favicon, select font, toggle dark; live preview applies theme vars to widget + dashboard sample.
3. **Chatbot Setup**: choose base model, temperature, system prompt template, allowedOrigins; generate `ApiKey` and embed snippet.
4. **Features**: toggles for modules (scheduling, intake forms, case study mode, analytics). Save flags to `FeatureFlag`.
5. **Billing**: show `PlanCards` → Stripe Checkout (trial on Basic). After return, persist `Subscription` and feature gates.
6. **Install**: show copy‑paste `<script>` install snippet, Next.js example component, and verification check (CORS + referer).
7. **Invite**: add teammates by email with role. Send magic link invites.

Wizard may be re‑entered to finish later. Add progress indicator and `Complete your setup` banner until all required steps are done.

---

## Stripe Integration

* Create products/prices in Stripe Dashboard; mirror in `Plan` table via seed script.
* API routes: `/api/stripe/checkout` (create checkout session per tenant), `/api/stripe/portal` (billing portal), `/api/stripe/webhook` (sync Subscription status, plan, trial end, cancellations).
* Enforce gates in UI + server (e.g., **Basic**: 5k tokens/mo, 1 chatbot; **Pro**: 100k tokens/mo, 3 chatbots; **Enterprise**: custom SSO, SLAs).

---

## Usage Metering & Limits

* `recordUsage(tenantId, type, qty, meta)` helper; write to `UsageEvent` and Redis counters.
* Middleware checks monthly counters vs plan limits (return 402/upgrade banner when exceeded).
* Simple **Usage** screen: charts and table by day/type.

---

## Branding Theming System

* CSS variables per tenant derived from `BrandingTheme`.
* `ThemeProvider` pulls theme by `tenantId`; dashboard + widget both consume.
* Live preview in Branding step; image upload to object storage; favicon generation helper.

---

## Chatbot Widget (Embed)

* Lightweight `<script>` that injects floating chat button + drawer. Options derived from `ChatbotConfig` + tenant theme.
* Secure with: allowedOrigins, per‑tenant API key, rate limiting, CORS.
* Provide Next.js/React install example + vanilla HTML snippet.

---

## Feature Flags

* Server‑enforced flags for: Scheduling, Client Intake, Interactive Case Study, Analytics.
* `useFeature(key)` hook and server guard. UI hides disabled features; routes 404 when disabled.

---

## Security & Guardrails

* Row‑level authorization: user must be `Membership` of `tenantId`.
* Input validation with Zod; output filtering; audit logs for destructive actions.
* API keys hashed; show once on create; rotate/revoke.
* Rate limits per IP and per `tenantId` for public endpoints.

---

## Env & Config (placeholders only)

```
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
REDIS_URL=
STORAGE_BUCKET_URL=
```

---

## Marketing Pages

* Home: value prop vs off‑the‑shelf chatbots (ownership, branding, feature control, multi‑tenant).
* Pricing: plans mapped to flags/limits; FAQ; compliance blurb.
* Docs CTA: "Developer install guide" linking to /docs/install within app.

---

## Tests & CI

* Unit: lib helpers (tenancy, plans, usage).
* E2E: signup → onboarding → checkout sandbox → return → theme preview → snippet verification.
* CI: typecheck, lint, test, build; preview deploy.

---

## Developer Tasks (create issues)

1. Edge middleware & `getTenantByHost`
2. Prisma schema + migrations + seed for Plans
3. Auth.js config + multi‑tenant redirect logic
4. Onboarding wizard (steps 1‑7)
5. Branding theme provider + CSS vars + preview
6. Feature flags (db + hooks + guards)
7. Stripe checkout, portal, webhooks; plan enforcement
8. Usage metering + UI
9. Chatbot widget + embed docs + origin checks
10. Tests + CI

Each issue should include **acceptance criteria** and **API contracts**.

---

## Case‑Study‑Ready Documentation (author now)

Create files with real substance (no filler):

* `/docs/architecture.md` — system overview, request lifecycles, subdomain routing, data isolation, diagrams.
* `/docs/onboarding-flow.md` — exact fields per step, validation, success/failure paths.
* `/docs/billing.md` — plan matrix, limits, webhook state machine.
* `/docs/tenancy.md` — middleware, `TenantGuard`, RLS patterns and pitfalls.
* `/docs/chatbot.md` — widget API, options, security (CORS, keys), prompt strategy hooks.
* `/docs/security.md` — authZ model, key rotation, rate limits, audit trails.
* `/docs/operations.md` — envs, migrations, seed, Stripe test cards, incident playbook.
* `/docs/case-study.md` — narrative for publishing: problem → architecture → onboarding UX → branding power → billing/limits → results.
* `/docs/adr/*` — decisions logged with context and consequences.

Use Mermaid where useful:

```
flowchart TD
  L[Landing] --> S[Sign up]
  S --> A[Auth Verify]
  A --> T[Create Tenant]
  T --> W1[Onboarding: Company]
  W1 --> W2[Branding]
  W2 --> W3[Chatbot]
  W3 --> W4[Features]
  W4 --> W5[Stripe Checkout]
  W5 --> W6[Install Snippet]
  W6 --> W7[Invite Team]
```

---

## Acceptance Criteria (global)

* New user can sign up, verify, create tenant, finish onboarding, pay via Stripe test mode, install widget on external site, and chat.
* Feature gates respect plan; exceeding limits surfaces upgrade path; Customer Portal works.
* Branding applies consistently to dashboard and widget.
* Unknown subdomains 404 gracefully; root shows marketing.
* Docs complete and copy‑paste‑able for a public case study.

---

## Stretch (if time allows)

* SSO/SAML for Enterprise
* Webhooks for conversation transcripts to customer CRMs
* Basic analytics dashboard with retention charts

---

## Implementation Notes

* Prefer **Server Actions** for mutations; co‑locate Zod schemas.
* Use **RSC** where possible; keep widget/client code lean.
* Don’t leak `tenantId` via client props; resolve on server from host.
* Log all Stripe webhook events; reconcile Subscription table idempotently.

---

## Hand‑Off Checklist

* [ ] Migrations run and seed populated
* [ ] Stripe test products/prices configured; keys in `.env.local`
* [ ] Wildcard DNS verified; subdomain routing e2e test passes
* [ ] All docs authored and linked from the app footer
* [ ] Playwright e2e script green end‑to‑end

> Build now following the above plan. Create all files, code, tests, and docs. Where a value is needed, wire the code to read from env or Stripe, not hardcoded. Provide a short summary of what you created in PR description.
