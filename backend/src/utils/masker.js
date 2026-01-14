const patterns = [
  { token: 'MASKED_EMAIL', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g },
  {
    token: 'MASKED_IP',
    regex: /\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)(?:\.(?:25[0-5]|2[0-4]\d|1?\d?\d)){3})\b/g,
  },
  {
    token: 'MASKED_IP',
    regex: /\b(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}\b/gi,
  },
  { token: 'MASKED_URL', regex: /\bhttps?:\/\/[^\s)"]+/gi },
  {
    token: 'MASKED_TIMESTAMP',
    regex: /\b\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?\b/g,
  },
  {
    token: 'MASKED_TIMESTAMP',
    regex:
      /\b(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2}\s+\d{2}:\d{2}:\d{2}\b/g,
  },
  {
    token: 'MASKED_PATH',
    regex: /\b[A-Za-z]:\\(?:[\w(). -]+\\?)+/g,
  },
  {
    token: 'MASKED_PATH',
    regex: /(?:\/|~\/)(?:[\w().-]+\/)+[\w().-]+/g,
  },
  { token: 'MASKED_USERNAME', regex: /\buser(?:name)?["'=:\s]+[\w.-]+\b/gi },
  { token: 'MASKED_EMPLOYEE_ID', regex: /\b(?:EMP|EMPLOYEE)[-_]?\d{3,}\b/gi },
  {
    token: 'MASKED_SECRET',
    regex: /\b(?:api[-_ ]?key|secret|token|key)["'=:\s]+[A-Za-z0-9_\-]{12,}\b/gi,
  },
  { token: 'MASKED_PHONE', regex: /\+?\d{1,3}[-.\s]?\(?\d{2,3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
];

function maskSensitiveData(rawText = '') {
  let sanitized = rawText;
  patterns.forEach(({ token, regex }) => {
    sanitized = sanitized.replace(regex, token);
  });
  return sanitized;
}

module.exports = {
  maskSensitiveData,
};

