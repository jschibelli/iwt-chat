import { PrismaClient } from '@prisma/client';
import { PLANS } from '../lib/plans';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed plans
  console.log('📋 Creating plans...');
  for (const [key, plan] of Object.entries(PLANS)) {
    await prisma.plan.upsert({
      where: { key: key as any },
      update: {
        label: plan.label,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        features: plan.features as any,
        limits: plan.limits as any,
      },
      create: {
        key: key as any,
        label: plan.label,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        features: plan.features as any,
        limits: plan.limits as any,
      },
    });
    console.log(`✅ Created/updated ${plan.label} plan`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
