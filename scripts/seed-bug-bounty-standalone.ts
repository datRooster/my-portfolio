#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { seedBugBountyData } from './seed-bug-bounty';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Bug Bounty data seeding...');
  
  try {
    await seedBugBountyData();
    console.log('🎉 Bug Bounty seeding completed successfully!');
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();