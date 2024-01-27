import { PrismaClient } from '@prisma/client/edge';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';

const prismaClientSingleton = () => {
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL?.[0] ?? 'TURSO_DATABASE_URL',
    authToken: process.env.TURSO_AUTH_TOKEN?.[0] ?? 'TURSO_AUTH_TOKEN'
  });
  const adapter = new PrismaLibSQL(libsql);

  return new PrismaClient({ adapter });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

globalForPrisma.prisma = prisma;
