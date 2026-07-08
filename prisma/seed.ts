import { config } from "dotenv";
import { resolve } from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

config({ path: resolve(process.cwd(), ".env") });

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@machupicchu.com";
  const password = process.env.ADMIN_PASSWORD ?? "Admin123456!";
  const name = process.env.ADMIN_NAME ?? "Administrator";

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "admin" },
    create: {
      name,
      email,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(`Admin user ensured: ${admin.email} (role: ${admin.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
