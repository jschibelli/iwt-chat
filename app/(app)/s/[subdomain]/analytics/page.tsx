import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireTenantAccess } from '@/lib/tenancy';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PageProps {
  params: Promise<{ subdomain: string; }>;
}

export default async function AnalyticsPage({ params }: PageProps) {
  const { subdomain } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const tenant = await requireTenantAccess(session.user.id, subdomain);
  
  // Get current month's usage
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  const monthlyUsage = await prisma.usageEvent.groupBy({
    by: ['type'],
    where: {
      tenantId: tenant.id,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      quantity: true,
    },
  });

  // Get last 7 days usage
  const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weeklyUsage = await prisma.usageEvent.groupBy({
    by: ['type'],
    where: {
      tenantId: tenant.id,
      createdAt: {
        gte: startOfWeek,
        lte: now,
      },
    },
    _sum: {
      quantity: true,
    },
  });

  // Get recent conversations (mock data for now)
  const recentConversations = [
    { id: 1, user: 'Anonymous', message: 'Hello, I need help with my order', timestamp: '2 hours ago', status: 'completed' },
    { id: 2, user: 'John Doe', message: 'What are your shipping options?', timestamp: '4 hours ago', status: 'completed' },
    { id: 3, user: 'Anonymous', message: 'How do I return an item?', timestamp: '1 day ago', status: 'completed' },
  ];

  const getUsageByType = (usage: any[], type: string) => {
    return usage.find(u => u.type === type)?._sum.quantity || 0;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Track your chatbot performance and user interactions
          </p>
        </div>

        <div className="grid gap-6">
          {/* Usage Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <Badge variant="secondary">This Month</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getUsageByType(monthlyUsage, 'messages')}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{getUsageByType(weeklyUsage, 'messages')} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                <Badge variant="secondary">This Month</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getUsageByType(monthlyUsage, 'conversations')}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{getUsageByType(weeklyUsage, 'conversations')} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Badge variant="secondary">This Month</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getUsageByType(monthlyUsage, 'users')}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{getUsageByType(weeklyUsage, 'users')} from last week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Badge variant="secondary">Average</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2s</div>
                <p className="text-xs text-muted-foreground">
                  -0.3s from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usage Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>
                  Message volume over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Chart coming soon</p>
                </div>
              </CardContent>
            </Card>

            {/* User Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>
                  Peak usage hours and user activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Chart coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Conversations</CardTitle>
              <CardDescription>
                Latest user interactions with your chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conversation) => (
                  <div key={conversation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{conversation.user}</span>
                        <Badge variant="outline" className="text-xs">
                          {conversation.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{conversation.message}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {conversation.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Key performance indicators for your chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600">Resolution Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">2.3</div>
                  <div className="text-sm text-gray-600">Avg Messages/Conversation</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
