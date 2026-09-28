const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("🟢 [Config] Conexión exitosa a PostgreSQL.");
    client.release();
  } catch (error) {
    console.error("🔴 [Config] Error conectando a la base de datos:", error.message);
  }
};

module.exports = { connectDB, pool };