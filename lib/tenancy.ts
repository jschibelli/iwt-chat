import { prisma } from './prisma';
import { rootDomain } from './utils';

export interface TenantContext {
  tenant: {
    id: string;
    slug: string;
    name: string;
    ownerId: string;
  };
  membership: {
    role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';
  };
}

export async function getTenantByHost(host: string): Promise<TenantContext | null> {
  const subdomain = extractSubdomain(host);
  
  if (!subdomain) {
    return null;
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: subdomain },
    select: {
      id: true,
      slug: true,
      name: true,
      ownerId: true,
    }
  });

  if (!tenant) {
    return null;
  }

  return {
    tenant,
    membership: { role: 'OWNER' as const } // For now, assume owner access
  };
}

export async function requireTenant(host: string): Promise<TenantContext> {
  const tenantContext = await getTenantByHost(host);
  
  if (!tenantContext) {
    throw new Error('Tenant not found');
  }
  
  return tenantContext;
}

export async function getUserTenants(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: {
      tenant: {
        select: {
          id: true,
          slug: true,
          name: true,
        }
      }
    }
  });
}

export async function requireTenantAccess(userId: string, subdomain: string) {
  // First get the tenant by subdomain
  const tenant = await prisma.tenant.findUnique({
    where: { slug: subdomain }
  });

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  // Then check if user has access to this tenant
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      tenantId: tenant.id,
    }
  });

  if (!membership) {
    throw new Error('Access denied');
  }

  return tenant;
}

function extractSubdomain(host: string): string | null {
  const hostname = host.split(':')[0];
  const rootDomainFormatted = rootDomain.split(':')[0];

  // Local development environment
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const fullUrlMatch = hostname.match(new RegExp(`([^.]+)\\.${rootDomainFormatted.replace('.', '\\.')}`));
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }
    return null;
  }

  // Production environment
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---');
    return parts.length > 0 ? parts[0] : null;
  }

  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, '') : null;
}
