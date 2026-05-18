import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  const userCount = await prisma.user.count();
  console.log(`User count: ${userCount}`);

  const itemCount = await prisma.item.count();
  console.log(`Item count: ${itemCount}`);

  const collectionCount = await prisma.collection.count();
  console.log(`Collection count: ${collectionCount}`);

  console.log("\nDatabase connection successful.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Database connection failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
