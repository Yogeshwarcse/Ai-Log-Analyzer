PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  file_hash TEXT NOT NULL,
  fingerprint_hash TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_at TEXT NOT NULL,
  severity TEXT,
  issue_type TEXT,
  root_cause TEXT,
  suggested_fix TEXT,
  ai_raw TEXT,
  masked_log TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  is_cached INTEGER NOT NULL DEFAULT 0,
  cached_from_log_id INTEGER,
  processed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cached_from_log_id) REFERENCES logs(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_logs_file_hash ON logs(file_hash);
CREATE INDEX IF NOT EXISTS idx_logs_fingerprint_hash ON logs(fingerprint_hash);
CREATE INDEX IF NOT EXISTS idx_logs_severity ON logs(severity);

