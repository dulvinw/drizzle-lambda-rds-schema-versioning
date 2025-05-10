import 'dotenv/config';
import {drizzle} from 'drizzle-orm/node-postgres';
import {MigrationConfig} from 'drizzle-orm/migrator'
import {migrate} from "drizzle-orm/pglite/migrator";

const db = drizzle(process.env.DATABASE_URL!);

async function generateMigrations() {
    const migrationConfig: MigrationConfig = {
        migrationsFolder: './drizzle',
        migrationsTable: '__drizzle_migrationser',
        migrationsSchema: 'drizzler'
    }

    await migrate(db, migrationConfig);
}

generateMigrations().then(() => {
    console.log("Done")
});
