const crypto = require('crypto');

function generateSHA256(input = '') {
  return crypto.createHash('sha256').update(input).digest('hex');
}

module.exports = {
  generateSHA256,
};

