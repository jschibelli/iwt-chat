// Test Stripe connection
const Stripe = require('stripe');

async function testStripeConnection() {
  console.log('🔍 Testing Stripe Connection...\n');
  
  // Check environment variables
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  
  console.log('📋 Environment Variables:');
  console.log(`STRIPE_SECRET_KEY: ${stripeSecretKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${stripePublishableKey ? '✅ Set' : '❌ Missing'}`);
  
  if (!stripeSecretKey) {
    console.log('\n❌ STRIPE_SECRET_KEY is not set. Please add it to your .env.local file:');
    console.log('STRIPE_SECRET_KEY=sk_test_...');
    return;
  }
  
  try {
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-07-30.basil',
    });
    
    console.log('\n🔌 Testing API Connection...');
    
    // Test basic API call
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe API connection successful!');
    console.log(`📊 Account ID: ${account.id}`);
    console.log(`🏢 Business Type: ${account.business_type || 'N/A'}`);
    
    // Test webhook endpoints
    console.log('\n🔗 Testing Webhook Endpoints...');
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    console.log(`📡 Found ${webhooks.data.length} webhook endpoints`);
    
    webhooks.data.forEach((webhook, index) => {
      console.log(`  ${index + 1}. ${webhook.url} (${webhook.status})`);
    });
    
    // Test products
    console.log('\n📦 Testing Products...');
    const products = await stripe.products.list({ limit: 5 });
    console.log(`📋 Found ${products.data.length} products`);
    
    products.data.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.name} (${product.id})`);
    });
    
    console.log('\n🎉 Stripe connection test completed successfully!');
    
  } catch (error) {
    console.log('\n❌ Stripe connection failed:');
    console.log(`Error: ${error.message}`);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n💡 This usually means:');
      console.log('1. Your STRIPE_SECRET_KEY is incorrect');
      console.log('2. You\'re using a test key in production or vice versa');
      console.log('3. The key has been revoked');
    }
  }
}

// Run the test
testStripeConnection().catch(console.error);
