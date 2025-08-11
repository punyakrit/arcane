import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

try {
  prisma = globalForPrisma.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
} catch (err) {
  console.error('Prisma client init error:', err)
  throw err
}

export { prisma }