const asyncHandler = (fn) => (req, res, next) => fn(req, res, next).catch(next);
const { processLogUpload, listLogs, getLogById } = require('../services/logService');

const uploadLog = asyncHandler(async (req, res) => {
  const result = await processLogUpload(req.file);
  res.status(201).json({
    message: result.wasCached ? 'Result served from cache' : 'Log processed',
    cacheStrategy: result.cacheStrategy,
    data: result.log,
  });
});

const fetchLogs = asyncHandler(async (req, res) => {
  const logs = await listLogs({
    search: req.query.search,
    severity: req.query.severity,
    sort: req.query.sort,
  });
  res.json({ data: logs });
});

const fetchLogById = asyncHandler(async (req, res) => {
  const log = await getLogById(req.params.id);
  res.json({ data: log });
});

module.exports = {
  uploadLog,
  fetchLogs,
  fetchLogById,
};

