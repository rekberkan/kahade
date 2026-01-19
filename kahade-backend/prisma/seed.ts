import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123456', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kahade.com' },
    update: {},
    create: {
      email: 'admin@kahade.com',
      name: 'Admin Kahade',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log('Created admin user:', admin);

  // Create test users
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@test.com' },
    update: {},
    create: {
      email: 'buyer@test.com',
      name: 'Test Buyer',
      password: hashedPassword,
      role: 'USER',
      phone: '+6281234567890',
    },
  });

  const seller = await prisma.user.upsert({
    where: { email: 'seller@test.com' },
    update: {},
    create: {
      email: 'seller@test.com',
      name: 'Test Seller',
      password: hashedPassword,
      role: 'USER',
      phone: '+6281234567891',
    },
  });

  console.log('Created test users:', { buyer, seller });

  // Create sample transaction
  const transaction = await prisma.transaction.create({
    data: {
      title: 'iPhone 14 Pro Max',
      description: 'Brand new iPhone 14 Pro Max 256GB',
      amount: 15000000,
      currency: 'IDR',
      status: 'PENDING',
      buyerId: buyer.id,
      sellerId: seller.id,
    },
  });

  console.log('Created sample transaction:', transaction);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
