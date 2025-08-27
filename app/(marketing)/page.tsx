import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Your Own AI Chatbot
            <span className="block text-blue-600">In Minutes</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-lg leading-8 text-gray-600">
            Build, customize, and deploy AI chatbots for your business. 
            Own your data, control your branding, and scale without limits.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button asChild size="lg" className="px-8">
              <Link href="/auth/signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
            From simple chat widgets to complex AI assistants, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Custom Branding</CardTitle>
              <CardDescription>
                Match your chatbot's look and feel to your brand perfectly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Custom colors and fonts</li>
                <li>• Your logo and favicon</li>
                <li>• Dark/light mode support</li>
                <li>• Responsive design</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Tenant Architecture</CardTitle>
              <CardDescription>
                Perfect for agencies and SaaS platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Isolated data per client</li>
                <li>• Custom subdomains</li>
                <li>• Role-based access</li>
                <li>• White-label ready</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
              <CardDescription>
                Powerful tools to enhance user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Appointment scheduling</li>
                <li>• Intake forms</li>
                <li>• Analytics dashboard</li>
                <li>• API integrations</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Analytics</CardTitle>
              <CardDescription>
                Track performance and optimize your chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Conversation metrics</li>
                <li>• User engagement</li>
                <li>• Response times</li>
                <li>• Conversion tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secure & Compliant</CardTitle>
              <CardDescription>
                Enterprise-grade security and privacy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• SOC 2 compliant</li>
                <li>• GDPR ready</li>
                <li>• Data encryption</li>
                <li>• Regular backups</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Simple setup for any website or app
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• One-line JavaScript</li>
                <li>• React components</li>
                <li>• REST API access</li>
                <li>• Webhook support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
            Join thousands of businesses using our platform to provide better customer support.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="px-8">
              <Link href="/auth/signup">Start Your Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
