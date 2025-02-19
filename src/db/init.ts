import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function initializeDatabase() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL
    });

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_settings (
                id SERIAL PRIMARY KEY,
                wallet_address TEXT NOT NULL,
                max_trade_amount DECIMAL NOT NULL,
                min_trade_amount DECIMAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        await pool.end();
    }
}

initializeDatabase(); 