// Dependencies
import fs from 'fs';
import path from 'path';
import mysql, { type RowDataPacket } from 'mysql2/promise';
import config from './dbEnv.js';

// MySQL connection pool
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  database: config.database,
  password: config.password,
  port: config.port,
});

async function runMigrations(migrationsDir: string) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Ensure the migrations table exists
    await connection.query(`
            CREATE TABLE IF NOT EXISTS migration_lock (
                id INT AUTO_INCREMENT PRIMARY KEY,
                locked BOOLEAN NOT NULL DEFAULT FALSE
            );
        `);
    await connection.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                migration_name VARCHAR(255) NOT NULL,
                applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

    // Check for a migration lock
    const [lockRows] = await connection.query<RowDataPacket[]>(
      'SELECT locked FROM migration_lock LIMIT 1',
    );

    if (lockRows.length && lockRows[0]?.locked) {
      throw new Error('Migrations are locked. Please resolve the lock and try again.');
    }

    // Set the lock
    if (!lockRows.length) {
      await connection.query('INSERT INTO migration_lock (locked) VALUES (TRUE)');
    } else {
      await connection.query('UPDATE migration_lock SET locked = TRUE');
    }

    // Get the list of applied migrations
    const [appliedMigrations] = await connection.query<RowDataPacket[]>(
      'SELECT migration_name FROM migrations',
    );
    const appliedSet = new Set(appliedMigrations.map((row) => row.migration_name));

    // Read and apply migrations
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    console.log('migrationFiles', migrationFiles);

    for (const file of migrationFiles) {
      if (!appliedSet.has(file)) {
        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
        console.log(`Applying migration: ${file}`);

        // Splitting sql by ';' is potentially dangerous
        const queries = migrationSQL
          .split(';')
          .map((query) => query.trim())
          .filter((query) => query.length > 0);

        for (const query of queries) {
          await connection.query(query);
        }
        await connection.query('INSERT INTO migrations (migration_name) VALUES (?)', [file]);
      }
    }

    // Release the lock
    await connection.query('UPDATE migration_lock SET locked = FALSE');
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

export async function applyMigrations() {
  try {
    const migrationsDir = path.join(__dirname, '../migrations');
    await runMigrations(migrationsDir);
    console.log('All migrations applied successfully.');
  } catch (error) {
    console.error('Error applying migrations:', error);
  } finally {
    await pool.end();
  }
}
