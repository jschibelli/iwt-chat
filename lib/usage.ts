import { prisma } from './prisma';
import { redis } from './redis';

export interface UsageEvent {
  tenantId: string;
  type: string;
  quantity: number;
  metadata?: Record<string, any>;
}

export async function recordUsage(event: UsageEvent) {
  // Record in database
  await prisma.usageEvent.create({
    data: {
      tenantId: event.tenantId,
      type: event.type,
      quantity: event.quantity,
      metadata: event.metadata || {} as any,
    }
  });

  // Update Redis counters for real-time limits
  const key = `usage:${event.tenantId}:${event.type}:${getCurrentMonth()}`;
  await redis.incrby(key, event.quantity);
  await redis.expire(key, 60 * 60 * 24 * 32); // Expire after 32 days
}

export async function getCurrentUsage(tenantId: string, type: string): Promise<number> {
  const key = `usage:${tenantId}:${type}:${getCurrentMonth()}`;
  const usage = await redis.get(key);
  return usage ? parseInt(usage as string) : 0;
}

export async function getMonthlyUsage(tenantId: string, type: string): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const result = await prisma.usageEvent.aggregate({
    where: {
      tenantId,
      type,
      createdAt: {
        gte: startOfMonth,
      }
    },
    _sum: {
      quantity: true,
    }
  });

  return result._sum.quantity || 0;
}

export async function checkUsageLimit(
  tenantId: string,
  type: string,
  limit: number
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const current = await getCurrentUsage(tenantId, type);
  return {
    allowed: current < limit,
    current,
    limit,
  };
}

export async function getUsageBreakdown(tenantId: string, month?: string) {
  const targetMonth = month || getCurrentMonth();
  const startDate = new Date(targetMonth + '-01');
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);

  const usage = await prisma.usageEvent.groupBy({
    by: ['type'],
    where: {
      tenantId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      }
    },
    _sum: {
      quantity: true,
    }
  });

  return usage.map(item => ({
    type: item.type,
    quantity: item._sum.quantity || 0,
  }));
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
