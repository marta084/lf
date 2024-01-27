import { PrismaClient } from '@prisma/client/edge';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';

const prismaClientSingleton = () => {
  // Access environment variables configured in Cloudflare Pages dashboard
  const url = process.env.TURSO_DATABASE_URL || 'fallback_url';
  const authToken = process.env.TURSO_AUTH_TOKEN || 'fallback_auth_token';

  const libsql = createClient({
    url,
    authToken
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
