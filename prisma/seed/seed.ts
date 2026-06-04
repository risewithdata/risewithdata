import { prisma } from '../prisma.config';

async function main() {
  // Seed placeholder - add dev data per feature
  console.log('Seeding placeholder data (no models defined yet)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
