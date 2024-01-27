import { PrismaClient } from '@prisma/client/edge'
import { PrismaLibSQL } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'
import * as util from 'util'

const libsql = createClient({
  url: 'file:replica.db',
  syncUrl: process.env.TURSO_DATABASE_URL ? [process.env.TURSO_DATABASE_URL][0] : undefined,
  authToken: process.env.TURSO_AUTH_TOKEN ? [process.env.TURSO_AUTH_TOKEN][0] : undefined,
});

const adapter = new PrismaLibSQL(libsql)

async function sync() {
  return libsql.sync()
}

const prismaClientSingleton = () => {
  sync()
  return new PrismaClient({ adapter }).$extends({
    /**
     * Query logging Client extension
     * Source: https://github.com/prisma/prisma-client-extensions/tree/main/query-logging
     */
    query: {
      $allModels: {
        async $allOperations({ operation, model, args, query }) {
          sync()
          const start = performance.now() // replace with performance.now() for browser environments
          const result = await query(args)
          const end = performance.now() // replace with performance.now() for browser environments
          const time = end - start
          console.log(
            util.inspect(
              { model, operation, time, args },
              { showHidden: false, depth: null, colors: true },
            ),
          )
          return result
        },
      },
    },
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

globalForPrisma.prisma = prisma
