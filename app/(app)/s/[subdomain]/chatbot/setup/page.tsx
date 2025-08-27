import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireTenantAccess } from '@/lib/tenancy';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


interface PageProps {
  params: Promise<{ subdomain: string; }>;
}

export default async function ChatbotSetupPage({ params }: PageProps) {
  const { subdomain } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const tenant = await requireTenantAccess(session.user.id, subdomain);
  
  // Get current chatbot config
  const chatbotConfig = await prisma.chatbotConfig.findUnique({
    where: { tenantId: tenant.id }
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Chatbot Setup</h1>
          <p className="text-gray-600 mt-2">
            Configure your AI chatbot settings and behavior
          </p>
        </div>

        <div className="grid gap-6">
          {/* Model Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>
                Choose the AI model and adjust its behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                   <Label htmlFor="model">AI Model</Label>
                   <select
                     id="model"
                     defaultValue={chatbotConfig?.model || 'gpt-3.5-turbo'}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                     <option value="gpt-4">GPT-4</option>
                     <option value="gpt-4-turbo">GPT-4 Turbo</option>
                   </select>
                 </div>
                <div>
                  <Label htmlFor="temperature">Temperature (Creativity)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    defaultValue={chatbotConfig?.temperature || 0.7}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Higher values make responses more creative, lower values more focused
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Prompt */}
          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
              <CardDescription>
                Define how your chatbot should behave and respond
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="You are a helpful AI assistant for [Your Company]. You help customers with..."
                defaultValue={chatbotConfig?.systemPrompt || 'You are a helpful AI assistant.'}
                className="min-h-[120px]"
              />
              <p className="text-sm text-gray-500 mt-2">
                This prompt defines the personality and behavior of your chatbot
              </p>
            </CardContent>
          </Card>

          {/* Widget Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Widget Appearance</CardTitle>
              <CardDescription>
                Customize how your chatbot widget looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="widgetTitle">Widget Title</Label>
                  <Input
                    id="widgetTitle"
                    placeholder="Chat with us"
                    defaultValue="Chat with us"
                  />
                </div>
                <div>
                  <Label htmlFor="widgetSubtitle">Widget Subtitle</Label>
                  <Input
                    id="widgetSubtitle"
                    placeholder="We're here to help!"
                    defaultValue="We're here to help!"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Input
                  id="welcomeMessage"
                  placeholder="Hi! How can I help you today?"
                  defaultValue="Hi! How can I help you today?"
                />
              </div>
            </CardContent>
          </Card>

          {/* Allowed Origins */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Restrictions</CardTitle>
              <CardDescription>
                Control which websites can embed your chatbot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="https://yourdomain.com&#10;https://www.yourdomain.com"
                defaultValue=""
                className="min-h-[100px]"
              />
              <p className="text-sm text-gray-500 mt-2">
                Enter one domain per line. Leave empty to allow all domains.
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg">
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
