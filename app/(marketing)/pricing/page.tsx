import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PLANS } from '@/lib/plans';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card key={key} className={`relative ${key === 'BASIC' ? 'ring-2 ring-blue-500' : ''}`}>
              {key === 'BASIC' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.label}</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">${plan.priceMonthly}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                {plan.priceYearly > 0 && (
                  <CardDescription>
                    ${plan.priceYearly}/year (save ${(plan.priceMonthly * 12) - plan.priceYearly})
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {plan.features.chatbots} chatbot{plan.features.chatbots > 1 ? 's' : ''}
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {plan.limits.maxTokensPerMonth.toLocaleString()} tokens/month
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    {plan.limits.maxTeamMembers} team member{plan.limits.maxTeamMembers > 1 ? 's' : ''}
                  </li>
                  {plan.features.scheduling && (
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Appointment scheduling
                    </li>
                  )}
                  {plan.features.intakeForms && (
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Intake forms
                    </li>
                  )}
                  {plan.features.caseStudyMode && (
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Case study mode
                    </li>
                  )}
                  {plan.features.analytics && (
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Advanced analytics
                    </li>
                  )}
                  {plan.features.sso && (
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      SSO/SAML
                    </li>
                  )}
                  {plan.features.prioritySupport && (
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Priority support
                    </li>
                  )}
                </ul>
                <Button 
                  asChild 
                  className={`w-full ${key === 'BASIC' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  <Link href={`/auth/signup?plan=${key.toLowerCase()}`}>
                    {plan.priceMonthly === 0 ? 'Get Started Free' : 'Start Free Trial'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What happens after the trial?</h3>
              <p className="text-gray-600">
                After your 14-day trial, you'll be charged for your selected plan. You can cancel anytime.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a setup fee?</h3>
              <p className="text-gray-600">
                No setup fees. You only pay for your chosen plan after the free trial period.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of businesses using our platform to provide better customer support.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/auth/signup">Start Your Free Trial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
