import { PrismaClient } from '@prisma/client/edge';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client/web';



const prismaClientSingleton = () => {
  const libsql = createClient({
    url: 'libsql://lf-marta084.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOiIyMDI0LTAxLTI1VDA2OjI3OjExLjc1NDczNDA4WiIsImlkIjoiYWJlOWEyYTMtYmI0NC0xMWVlLWI0MGItMzIwZDcwZWY1MzgyIn0.ZAHcWKC71a92hWz3Xkax7HlXgUbc-f_zX2tfrSwR_Xeew-kAkYAjWCp85vYvZmi622vEXAvTRf4Z24AjBY2uDA',
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
