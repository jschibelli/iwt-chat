import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireTenant, requireTenantAccess } from '@/lib/tenancy';
import { getCurrentUsage, getUsageBreakdown } from '@/lib/usage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function TenantDashboardPage({ params }: PageProps) {
  const { subdomain } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const tenant = await requireTenantAccess(session.user.id, subdomain);

  // Get usage stats
  const tokenUsage = await getCurrentUsage(tenant.id, 'tokens');
  const apiUsage = await getCurrentUsage(tenant.id, 'api_calls');
  const monthlyUsage = await getUsageBreakdown(tenant.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to {tenant.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your AI chatbot and track performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tokenUsage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{apiUsage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                                 {monthlyUsage.find((u: { type: string; quantity: number }) => u.type === 'conversations')?.quantity || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Chatbot Setup</CardTitle>
              <CardDescription>
                Configure your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={`/s/${subdomain}/chatbot/setup`}>
                  Configure
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Branding</CardTitle>
              <CardDescription>
                Customize your chatbot's appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/s/${subdomain}/settings/branding`}>
                  Customize
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Install</CardTitle>
              <CardDescription>
                Get your embed code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/s/${subdomain}/chatbot/install`}>
                  Get Code
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Analytics</CardTitle>
              <CardDescription>
                View detailed insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/s/${subdomain}/analytics`}>
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest conversations and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity to show</p>
              <p className="text-sm">Start using your chatbot to see activity here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
