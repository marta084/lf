import { PrismaClient } from '@prisma/client/edge';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';

type PrismaClientSingleton = PrismaClient;

export default async function fetch(request: Request, env: Record<string, string | undefined>, ctx: ExecutionContext): Promise<Response> {
  const prisma = await getPrismaClient(env);

  try {
    const users = await prisma.user.findMany();
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error querying Prisma:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500
    });
  }
}

async function getPrismaClient(env: Record<string, string | undefined>): Promise<PrismaClientSingleton> {
  const url = env.TURSO_DATABASE_URL?.trim();
  if (!url) {
    throw new Error("TURSO_DATABASE_URL env var is not defined");
  }

  const authToken = env.TURSO_AUTH_TOKEN?.trim();
  if (!authToken) {
    throw new Error("TURSO_AUTH_TOKEN env var is not defined");
  }

  const libsql = createClient({
    url: `libsql://${url}`,
    authToken,
  });

  const adapter = new PrismaLibSQL(libsql);
  return new PrismaClient({ adapter });
}
