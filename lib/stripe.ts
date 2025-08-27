import Stripe from 'stripe';
import { prisma } from './prisma';
import { PLANS } from './plans';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function createCheckoutSession(
  tenantId: string,
  planKey: string,
  successUrl: string,
  cancelUrl: string
) {
  const plan = PLANS[planKey as keyof typeof PLANS];
  if (!plan) {
    throw new Error('Invalid plan');
  }

  // Get or create Stripe customer
  let customer = await getStripeCustomer(tenantId);
  if (!customer) {
    customer = await createStripeCustomer(tenantId);
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${plan.label} Plan`,
            description: `Chatbot SaaS - ${plan.label} Plan`,
          },
          unit_amount: plan.priceMonthly * 100, // Convert to cents
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      tenantId,
      planKey,
    },
  });

  return session;
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getStripeCustomer(tenantId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { tenantId },
    select: { stripeCustomerId: true }
  });

  if (!subscription?.stripeCustomerId) {
    return null;
  }

  try {
    return await stripe.customers.retrieve(subscription.stripeCustomerId);
  } catch {
    return null;
  }
}

export async function createStripeCustomer(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { owner: true }
  });

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  const customer = await stripe.customers.create({
    email: tenant.owner.email,
    name: tenant.name,
    metadata: {
      tenantId,
    },
  });

  return customer;
}

export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.Invoice);
      break;
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { tenantId, planKey } = session.metadata || {};
  
  if (!tenantId || !planKey) {
    throw new Error('Missing metadata in checkout session');
  }

  const plan = await prisma.plan.findUnique({
    where: { key: planKey as any }
  });

  if (!plan) {
    throw new Error('Plan not found');
  }

  // Find existing subscription or create new one
  const existingSubscription = await prisma.subscription.findFirst({
    where: { tenantId }
  });

  if (existingSubscription) {
    await prisma.subscription.update({
      where: { id: existingSubscription.id },
      data: {
        planId: plan.id,
        stripeCustomerId: session.customer as string,
        stripeSubId: session.subscription as string,
        status: 'ACTIVE',
        trialEndsAt: session.subscription ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days trial
      }
    });
  } else {
    await prisma.subscription.create({
      data: {
        tenantId,
        planId: plan.id,
        stripeCustomerId: session.customer as string,
        stripeSubId: session.subscription as string,
        status: 'ACTIVE',
        trialEndsAt: session.subscription ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubId: subscription.id }
  });

  if (!dbSubscription) {
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: subscription.status.toUpperCase() as any,
      cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000) : null,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubId: subscription.id }
  });

  if (!dbSubscription) {
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'CANCELED',
      cancelAt: new Date(),
    },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Extract subscription ID from invoice metadata or use a different approach
  const subscriptionId = (invoice as any).subscription;
  
  if (!subscriptionId) {
    return;
  }

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubId: subscriptionId }
  });

  if (!dbSubscription) {
    return;
  }

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'PAST_DUE',
    },
  });
}
