import { prisma } from "./lib/prisma";

async function main() {
  const users = await prisma.user.findMany();
  console.log("Connected to DB ✅");
  console.log(users);
}

main()
  .catch((e) => {
    console.error("DB Error ❌", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
