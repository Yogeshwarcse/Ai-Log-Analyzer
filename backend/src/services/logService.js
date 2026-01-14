const { getDb } = require('../db/connection');
const { maskSensitiveData } = require('../utils/masker');
const { generateSHA256 } = require('../utils/hash');
const { generateFingerprint } = require('../utils/fingerprint');
const { analyzeLog } = require('./openaiService');
const { normalizeSeverity } = require('../utils/severity');

async function findCachedLog(db, fileHash, fingerprintHash) {
  const exact = await db.get('SELECT * FROM logs WHERE file_hash = ? ORDER BY id DESC LIMIT 1', fileHash);
  if (exact) {
    return { match: exact, strategy: 'hash' };
  }

  const similar = await db.get('SELECT * FROM logs WHERE fingerprint_hash = ? ORDER BY id DESC LIMIT 1', fingerprintHash);
  if (similar) {
    return { match: similar, strategy: 'fingerprint' };
  }

  return { match: null, strategy: null };
}

async function persistLog(db, payload) {
  const stmt = await db.run(
    `INSERT INTO logs
      (filename, file_hash, fingerprint_hash, file_size, uploaded_at, severity, issue_type,
        root_cause, suggested_fix, ai_raw, masked_log, status, is_cached, cached_from_log_id, processed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.filename,
      payload.fileHash,
      payload.fingerprintHash,
      payload.fileSize,
      payload.uploadedAt,
      payload.severity,
      payload.issueType,
      payload.rootCause,
      payload.suggestedFix,
      payload.aiRaw,
      payload.maskedLog,
      payload.status,
      payload.isCached ? 1 : 0,
      payload.cachedFromLogId || null,
      payload.processedAt,
    ],
  );

  return db.get('SELECT * FROM logs WHERE id = ?', stmt.lastID);
}

async function processLogUpload(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  const db = await getDb();
  const rawText = file.buffer.toString('utf-8');
  const maskedLog = maskSensitiveData(rawText);
  const maskedPreview = maskedLog.slice(0, 20000);
  const fileHash = generateSHA256(rawText);
  const { fingerprintHash } = generateFingerprint(rawText);

  const cached = await findCachedLog(db, fileHash, fingerprintHash);
  if (cached.match) {
    const saved = await persistLog(db, {
      filename: file.originalname,
      fileHash,
      fingerprintHash,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      severity: cached.match.severity,
      issueType: cached.match.issue_type,
      rootCause: cached.match.root_cause,
      suggestedFix: cached.match.suggested_fix,
      aiRaw: cached.match.ai_raw,
      maskedLog: maskedPreview,
      status: 'completed',
      isCached: true,
      cachedFromLogId: cached.match.id,
      processedAt: cached.match.processed_at || new Date().toISOString(),
    });

    return {
      log: saved,
      wasCached: true,
      cacheStrategy: cached.strategy,
    };
  }

  const aiResult = await analyzeLog(maskedLog);
  const saved = await persistLog(db, {
    filename: file.originalname,
    fileHash,
    fingerprintHash,
    fileSize: file.size,
    uploadedAt: new Date().toISOString(),
    severity: normalizeSeverity(aiResult.severity),
    issueType: aiResult.issueType,
    rootCause: aiResult.rootCause,
    suggestedFix: aiResult.suggestedFix,
    aiRaw: aiResult.raw,
    maskedLog: maskedPreview,
    status: 'completed',
    isCached: false,
    cachedFromLogId: null,
    processedAt: new Date().toISOString(),
  });

  return {
    log: saved,
    wasCached: false,
    cacheStrategy: null,
  };
}

async function listLogs({ search = '', severity, sort }) {
  const db = await getDb();
  const params = [];
  let query = 'SELECT * FROM logs';

  const clauses = [];
  if (search) {
    clauses.push('(filename LIKE ? OR issue_type LIKE ? OR root_cause LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (severity) {
    clauses.push('LOWER(severity) = ?');
    params.push(severity.toLowerCase());
  }
  if (clauses.length) {
    query += ` WHERE ${clauses.join(' AND ')}`;
  }

  if (sort === 'severity') {
    query += ` ORDER BY 
      CASE severity 
        WHEN 'Critical' THEN 4
        WHEN 'High' THEN 3
        WHEN 'Medium' THEN 2
        WHEN 'Low' THEN 1
        ELSE 0
      END DESC,
      created_at DESC`;
  } else {
    query += ' ORDER BY created_at DESC';
  }

  return db.all(query, params);
}

async function getLogById(id) {
  const db = await getDb();
  const log = await db.get('SELECT * FROM logs WHERE id = ?', id);
  if (!log) {
    const error = new Error('Log not found');
    error.status = 404;
    throw error;
  }
  return log;
}

module.exports = {
  processLogUpload,
  listLogs,
  getLogById,
};

