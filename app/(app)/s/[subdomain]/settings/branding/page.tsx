import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireTenantAccess } from '@/lib/tenancy';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PageProps {
  params: Promise<{ subdomain: string; }>;
}

export default async function BrandingSettingsPage({ params }: PageProps) {
  const { subdomain } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const tenant = await requireTenantAccess(session.user.id, subdomain);
  
  // Get current branding theme
  const brandingTheme = await prisma.brandingTheme.findUnique({
    where: { tenantId: tenant.id }
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Branding Settings</h1>
          <p className="text-gray-600 mt-2">
            Customize the visual appearance of your chatbot and dashboard
          </p>
        </div>

        <div className="grid gap-6">
          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic information about your company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  defaultValue={tenant.name}
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input
                  id="subdomain"
                  value={subdomain}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Your unique subdomain for accessing the platform
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>
                Customize the colors used throughout your dashboard and chatbot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      defaultValue={brandingTheme?.primary || '#3b82f6'}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      defaultValue={brandingTheme?.primary || '#3b82f6'}
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      defaultValue={brandingTheme?.secondary || '#64748b'}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      defaultValue={brandingTheme?.secondary || '#64748b'}
                      placeholder="#64748b"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="accentColor"
                      type="color"
                      defaultValue={brandingTheme?.accent || '#f59e0b'}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      defaultValue={brandingTheme?.accent || '#f59e0b'}
                      placeholder="#f59e0b"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="surfaceColor">Surface Color</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Input
                      id="surfaceColor"
                      type="color"
                      defaultValue={brandingTheme?.surface || '#ffffff'}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      type="text"
                      defaultValue={brandingTheme?.surface || '#ffffff'}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle>Typography</CardTitle>
              <CardDescription>
                Choose the font family for your interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <select
                  id="fontFamily"
                  defaultValue={brandingTheme?.font || 'Inter'}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Inter">Inter (Default)</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Lato">Lato</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Logo & Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Logo & Assets</CardTitle>
              <CardDescription>
                Upload your company logo and favicon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo">Company Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended size: 200x200px, PNG or SVG format
                </p>
              </div>
              <div>
                <Label htmlFor="favicon">Favicon</Label>
                <Input
                  id="favicon"
                  type="file"
                  accept="image/*"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Recommended size: 32x32px, ICO or PNG format
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Dark Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Dark Mode</CardTitle>
              <CardDescription>
                Enable or disable dark mode for your interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="darkMode"
                  defaultChecked={brandingTheme?.darkMode || false}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="darkMode">Enable dark mode</Label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                When enabled, users can toggle between light and dark themes
              </p>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button size="lg">
              Save Branding Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
