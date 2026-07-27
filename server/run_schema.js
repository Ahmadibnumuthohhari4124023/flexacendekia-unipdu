const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runSchema() {
  let connection;
  try {
    // 1. Connect without database selected first (to create it)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true // Important for running multiple statements from file
    });

    console.log('✅ Terhubung ke MySQL Server');

    // 2. Read schema file
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // 3. Execute schema
    console.log('Menjalankan schema.sql...');
    await connection.query(schemaSql);

    console.log('✅ Berhasil membuat database dan tabel-tabel!');
  } catch (err) {
    console.error('❌ Gagal menjalankan schema:', err.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runSchema();
