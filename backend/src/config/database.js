const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'pokeapp',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL DEFAULT 'trainer',
      pokemon_id INTEGER NOT NULL,
      pokemon_name VARCHAR(100) NOT NULL,
      pokemon_image TEXT,
      pokemon_types TEXT[] DEFAULT '{}',
      note TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(username, pokemon_id)
    )
  `);
  console.log('[DB] Database initialized');
}

module.exports = { pool, initDatabase };
