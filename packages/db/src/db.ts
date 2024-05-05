import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// for migrations
// export const migrationClient = postgres(process.env.DRIZZLE_DATABASE_URL!, { max: 1 });
const link = process.env.DRIZZLE_DATABASE_URL!
console.log(link)
// for query purposes
const queryClient = postgres(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(queryClient);
