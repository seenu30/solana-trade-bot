import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pgTable, text, numeric, serial, timestamp,boolean } from "drizzle-orm/pg-core";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

export const userSettings = pgTable("user_settings", {
    id: serial('id').primaryKey(),
    wallet_address: text('wallet_address').notNull(),
    max_trade_amount: numeric('max_trade_amount').notNull(),
    min_trade_amount: numeric('min_trade_amount').notNull(),
    auto_sell: boolean('auto_sell').default(true), // New field for auto sell
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow()
});
