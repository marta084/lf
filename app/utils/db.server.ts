import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient({
  datasourceUrl:
    'prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiNDEzZjA2MzEtNjFhZi00OTc0LTk0MGEtMmY5OTY3YTU2N2FkIiwidGVuYW50X2lkIjoiMTg0NWMwMmM3YzhhNjMxNTFhZDZmMmIyMDIzN2Q5Y2IzNmNjODFkN2ViMmNlMDdjZGFhNGI3OTZjODJmM2VhNyIsImludGVybmFsX3NlY3JldCI6ImQ4MDg0OTYyLWYxY2MtNDkwMy1iZTBjLThiZTE2NTZhZTE1NSJ9.8Emsl0uzG4NOlVuulSLo5diAr3i2hZtx9uyRDAc2O8o',
}).$extends(withAccelerate())

export default prisma
