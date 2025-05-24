import {defineConfig} from "drizzle-kit";
import * as process from "node:process";

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'mysql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    }
})