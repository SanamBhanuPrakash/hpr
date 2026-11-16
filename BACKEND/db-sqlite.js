import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Staging-only alternative to db.js's real MySQL pool — used strictly when
// DB_DRIVER=sqlite is set (see db.js). Exists because the shadesofgreen EC2
// box has very little free RAM (~87MB at idle on a ~913MB total instance);
// a real MySQL/MariaDB server process would risk memory pressure on the
// same box the real production backend runs on. SQLite adds no separate
// server process at all — just this file, loaded in-process.
//
// Exposes the exact same shape shadesofgreenFormRoutes.js already calls:
// `await db.query(sql, params)` returning `[rows]` — so the route file
// itself needed zero changes to support this, only db.js's driver
// selection. The one real MySQL-dialect query in that file (the round-30
// visit-count TIMESTAMPDIFF) is branched separately — see its own comment.
const dbPath = process.env.SQLITE_DB_PATH || path.join(__dirname, "staging.sqlite3");
const sqlite = new Database(dbPath);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS Shadesofgreen_enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    interest TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS shadesofgreen_leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    request_type TEXT DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// mysql2's placeholder syntax (`?`) is identical to better-sqlite3's, so no
// rewriting is needed for ordinary INSERT/SELECT statements. The one real
// exception: round 30's visit-counter query uses MySQL's TIMESTAMPDIFF/NOW(),
// which SQLite doesn't have — translated here, invisibly, so
// shadesofgreenFormRoutes.js (and real production behavior) never needs to
// know a second database dialect exists at all. `julianday('now')` is UTC,
// same as MySQL's NOW() in this deployment, so this preserves round 30's
// actual fix (computing the gap against one single consistent clock).
function translateMySqlToSqlite(sql) {
  if (sql.includes("TIMESTAMPDIFF(MINUTE, created_at, NOW())")) {
    return sql.replace(
      "TIMESTAMPDIFF(MINUTE, created_at, NOW())",
      "CAST((julianday('now') - julianday(created_at)) * 1440 AS INTEGER)"
    );
  }
  return sql;
}

function query(sql, params = []) {
  const translated = translateMySqlToSqlite(sql);
  const trimmed = translated.trim().toUpperCase();
  const stmt = sqlite.prepare(translated);
  if (trimmed.startsWith("SELECT")) {
    return Promise.resolve([stmt.all(...params)]);
  }
  const info = stmt.run(...params);
  // Shaped like mysql2's OkPacket closely enough for this codebase's
  // actual usage (nothing here reads insertId/affectedRows today, but
  // matching the shape avoids a surprise if that ever changes).
  return Promise.resolve([{ insertId: info.lastInsertRowid, affectedRows: info.changes }]);
}

export default { query };
