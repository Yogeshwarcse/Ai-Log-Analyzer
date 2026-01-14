const { maskSensitiveData } = require('./masker');
const { generateSHA256 } = require('./hash');

function normalizeForFingerprint(text = '') {
  return maskSensitiveData(text)
    .toLowerCase()
    .replace(/\d+/g, '#')
    .replace(/[^a-z#\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateFingerprint(text = '') {
  const normalized = normalizeForFingerprint(text);
  return {
    normalized,
    fingerprintHash: generateSHA256(normalized),
  };
}

module.exports = {
  generateFingerprint,
};

