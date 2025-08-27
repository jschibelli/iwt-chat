import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireTenantAccess } from '@/lib/tenancy';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CopyButton } from '@/components/ui/copy-button';

interface PageProps {
  params: Promise<{ subdomain: string; }>;
}

export default async function ChatbotInstallPage({ params }: PageProps) {
  const { subdomain } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const tenant = await requireTenantAccess(session.user.id, subdomain);
  
  const embedCode = `<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'http://localhost:3000/widget.js';
    script.setAttribute('data-tenant', '${subdomain}');
    document.head.appendChild(script);
  })();
</script>`;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Install Chatbot</h1>
          <p className="text-gray-600 mt-2">
            Add your AI chatbot to your website with a simple code snippet
          </p>
        </div>

        <div className="grid gap-6">
          {/* Installation Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
              <CardDescription>
                Follow these steps to add your chatbot to your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Step 1: Copy the Embed Code</h3>
                <p className="text-sm text-gray-600">
                  Copy the code snippet below and paste it into your website's HTML, just before the closing &lt;/body&gt; tag.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Step 2: Paste into Your Website</h3>
                <p className="text-sm text-gray-600">
                  Add the code to your website's HTML, WordPress theme, or any other platform that allows custom HTML.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Step 3: Test Your Chatbot</h3>
                <p className="text-sm text-gray-600">
                  Visit your website and look for the chat widget in the bottom-right corner. Click it to test the conversation.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Embed Code */}
          <Card>
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>
                Copy this code and paste it into your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{embedCode}</code>
                </pre>
                <CopyButton 
                  text={embedCode}
                  className="absolute top-2 right-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Platform-Specific Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Platform-Specific Instructions</CardTitle>
              <CardDescription>
                Detailed instructions for popular platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">WordPress</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Add the code to your theme's footer.php file or use a plugin like "Header and Footer Scripts".
                </p>
                <Badge variant="secondary">WordPress</Badge>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Shopify</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Go to Online Store → Themes → Edit code → Layout → theme.liquid and paste before &lt;/body&gt;.
                </p>
                <Badge variant="secondary">Shopify</Badge>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Wix</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Add an HTML element to your page and paste the code inside it.
                </p>
                <Badge variant="secondary">Wix</Badge>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Squarespace</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Go to Settings → Advanced → Code Injection → Footer and paste the code.
                </p>
                <Badge variant="secondary">Squarespace</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
              <CardDescription>
                Common issues and solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-red-600">Chatbot not appearing?</h3>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Make sure the code is placed before the closing &lt;/body&gt; tag</li>
                  <li>• Check that your website allows external scripts</li>
                  <li>• Clear your browser cache and refresh the page</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-red-600">Widget not loading?</h3>
                <ul className="text-sm text-gray-600 mt-2 space-y-1">
                  <li>• Verify the tenant slug in the embed code matches your subdomain</li>
                  <li>• Check your browser's developer console for errors</li>
                  <li>• Ensure your chatbot is properly configured in the setup page</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
