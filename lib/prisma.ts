import { PrismaClient } from '@prisma/client';
import { withPoolLimits } from './prisma-pool';

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL;
  return url ? new PrismaClient({ datasourceUrl: withPoolLimits(url) }) : new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Kept on globalThis in production too: Next.js can load this module more than
// once in a server process, and every extra client opens its own pool.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
globalThis.prismaGlobal = prisma;

export default prisma;
