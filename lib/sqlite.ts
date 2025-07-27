import Database from 'better-sqlite3';
import path from 'path';

// Creates (if needed) and returns a singleton SQLite database connection.
// The database file lives in /data/app.db relative to project root.
// This helper is lightweight and synchronous ‑ perfect for small apps/deployments.

const dbPath = path.join(process.cwd(), 'data', 'app.db');
const db = new Database(dbPath);

// Ensure the `test` table exists (mirrors the old Supabase `test` table).
// Extend or migrate as needed.
db.exec(`
  CREATE TABLE IF NOT EXISTS test (
    id TEXT PRIMARY KEY,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export { db };
