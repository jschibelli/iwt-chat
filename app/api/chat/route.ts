import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { recordUsage, checkUsageLimit } from '@/lib/usage';
import { getTenantByHost } from '@/lib/tenancy';
import { headers } from 'next/headers';

const chatSchema = z.object({
  message: z.string().min(1).max(1000),
  tenantSlug: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, tenantSlug } = chatSchema.parse(body);

    // Get tenant from subdomain or slug
    const headersList = await headers();
    const host = headersList.get('host') || '';
    
    let tenantContext;
    if (tenantSlug) {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        include: { subscriptions: { include: { plan: true } } }
      });
      if (!tenant) {
        return NextResponse.json(
          { message: 'Tenant not found' },
          { status: 404 }
        );
      }
      tenantContext = { tenant, membership: { role: 'OWNER' as const } };
    } else {
      tenantContext = await getTenantByHost(host);
      if (!tenantContext) {
        return NextResponse.json(
          { message: 'Tenant not found' },
          { status: 404 }
        );
      }
    }

    // Check usage limits
    const tokenLimit = await checkUsageLimit(
      tenantContext.tenant.id,
      'tokens',
      1000 // Default limit, should come from plan
    );

    if (!tokenLimit.allowed) {
      return NextResponse.json(
        { message: 'Usage limit exceeded. Please upgrade your plan.' },
        { status: 429 }
      );
    }

    // Get chatbot configuration
    const config = await prisma.chatbotConfig.findUnique({
      where: { tenantId: tenantContext.tenant.id }
    });

    if (!config) {
      return NextResponse.json(
        { message: 'Chatbot not configured' },
        { status: 400 }
      );
    }

    // Simple AI response (replace with actual AI integration)
    const response = `Thank you for your message: "${message}". This is a demo response from your AI chatbot. In a real implementation, this would connect to OpenAI, Anthropic, or another AI provider.`;

    // Record usage
    await recordUsage({
      tenantId: tenantContext.tenant.id,
      type: 'tokens',
      quantity: message.length + response.length,
      metadata: { messageLength: message.length, responseLength: response.length }
    });

    await recordUsage({
      tenantId: tenantContext.tenant.id,
      type: 'api_calls',
      quantity: 1,
      metadata: { endpoint: '/api/chat' }
    });

    return NextResponse.json({
      response,
      usage: {
        tokens: message.length + response.length,
        remaining: tokenLimit.limit - tokenLimit.current - (message.length + response.length)
      }
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
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
