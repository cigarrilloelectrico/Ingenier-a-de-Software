import { defineConfig } from 'prisma/config';
import { DATABASE_URL } from './src/config/configEnv.js';

// Prisma CLI configuration: every .prisma file inside src/models is part of the schema
export default defineConfig({
  schema: 'src/models',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: DATABASE_URL,
  },
});
