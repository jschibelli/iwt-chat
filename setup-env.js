const fs = require('fs');
const path = require('path');

console.log('🔧 Environment Setup Helper\n');

// Check if .env.local already exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('📁 .env.local file already exists');
  console.log('Please edit it manually to add your Stripe keys.\n');
} else {
  console.log('📝 Creating .env.local file...\n');
  
  const envContent = `# Database
DATABASE_URL="file:./dev.db"

# Auth
AUTH_SECRET="your-auth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# Redis
REDIS_URL="redis://localhost:6379"

# App
NEXT_PUBLIC_ROOT_DOMAIN="localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Stripe (Get these from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# OpenAI (for chatbot functionality)
OPENAI_API_KEY="sk-your_openai_api_key_here"
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local file created successfully!');
    console.log('📝 Please edit the file and replace the placeholder values with your actual API keys.\n');
  } catch (error) {
    console.log('❌ Failed to create .env.local file:', error.message);
    console.log('Please create the file manually using the template in setup-env.md\n');
  }
}

console.log('📋 Next Steps:');
console.log('1. Get your Stripe keys from: https://dashboard.stripe.com/apikeys');
console.log('2. Edit .env.local and replace the placeholder values');
console.log('3. Run: node test-stripe.js');
console.log('4. Run: npm run build');
console.log('5. Run: npm run dev');
console.log('\n📖 For detailed instructions, see: setup-env.md');
