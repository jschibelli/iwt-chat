import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/plans';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  plan: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, plan } = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      }
    });

    // Create default tenant
    const tenantSlug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const tenant = await prisma.tenant.create({
      data: {
        slug: tenantSlug,
        name: `${name}'s Organization`,
        ownerId: user.id,
      }
    });

    // Add user as owner of the tenant
    await prisma.membership.create({
      data: {
        userId: user.id,
        tenantId: tenant.id,
        role: 'OWNER',
      }
    });

    // Create default branding theme
    await prisma.brandingTheme.create({
      data: {
        tenantId: tenant.id,
      }
    });

    // Create default chatbot config
    await prisma.chatbotConfig.create({
      data: {
        tenantId: tenant.id,
      }
    });

    // Set up subscription based on plan
    const planKey = plan?.toUpperCase() || 'FREE';
    const selectedPlan = await prisma.plan.findUnique({
      where: { key: planKey as any }
    });

    if (selectedPlan) {
      await prisma.subscription.create({
        data: {
          tenantId: tenant.id,
          planId: selectedPlan.id,
          status: 'TRIALING',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        }
      });
    }

    // Set up feature flags based on plan
    const planFeatures = PLANS[planKey as keyof typeof PLANS];
    if (planFeatures) {
      const featureFlags = [
        { key: 'scheduling', enabled: planFeatures.features.scheduling },
        { key: 'intakeForms', enabled: planFeatures.features.intakeForms },
        { key: 'caseStudyMode', enabled: planFeatures.features.caseStudyMode },
        { key: 'analytics', enabled: planFeatures.features.analytics },
        { key: 'sso', enabled: planFeatures.features.sso },
        { key: 'prioritySupport', enabled: planFeatures.features.prioritySupport },
      ];

      await Promise.all(
        featureFlags.map(flag =>
          prisma.featureFlag.create({
            data: {
              tenantId: tenant.id,
              key: flag.key,
              enabled: flag.enabled,
            }
          })
        )
      );
    }

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
