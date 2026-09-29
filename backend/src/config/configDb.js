import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import { DATABASE_URL } from './configEnv.js';

/**
 * Prisma Client connected to PostgreSQL through the `pg` driver adapter.
 * Import this single instance everywhere instead of creating new clients.
 * @type {PrismaClient}
 */
export const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: DATABASE_URL }),
});

// Connects to the database and stops the process if the connection fails
export async function connectDB() {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log('=> Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}
