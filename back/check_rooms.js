import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const rooms = await prisma.room.findMany();
  console.log('--- QUARTOS NO BANCO ---');
  console.log(JSON.stringify(rooms, null, 2));
  console.log('------------------------');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
