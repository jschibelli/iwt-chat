import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireTenant, requireTenantAccess } from '@/lib/tenancy';
import { createCheckoutSession } from '@/lib/stripe';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const headersList = await headers();
    const host = headersList.get('host') || '';
    
    const tenantContext = await requireTenant(host);
    await requireTenantAccess(tenantContext.tenant.id, session.user.id);

    const { planKey } = await request.json();

    if (!planKey) {
      return NextResponse.json(
        { message: 'Plan key is required' },
        { status: 400 }
      );
    }

    const successUrl = `${request.nextUrl.origin}/settings/billing?success=true`;
    const cancelUrl = `${request.nextUrl.origin}/settings/billing?canceled=true`;

    const checkoutSession = await createCheckoutSession(
      tenantContext.tenant.id,
      planKey,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({
      url: checkoutSession.url
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
