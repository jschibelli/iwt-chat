import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserTenants } from '@/lib/tenancy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userTenants = await getUserTenants(session.user.id);

  if (userTenants.length === 0) {
    redirect('/onboarding');
  }

  if (userTenants.length === 1) {
    // Redirect to the single tenant's subdomain
    const tenant = userTenants[0].tenant;
    redirect(`https://${tenant.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'}`);
  }

  // Multiple tenants - show tenant switcher
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {session.user.name}!</h1>
          <p className="mt-2 text-gray-600">Choose an organization to continue</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userTenants.map((membership) => (
            <Card key={membership.tenant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{membership.tenant.name}</CardTitle>
                <CardDescription>
                  Role: {membership.role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`https://${membership.tenant.slug}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'}`}>
                    Go to Dashboard
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/onboarding">
              Create New Organization
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
