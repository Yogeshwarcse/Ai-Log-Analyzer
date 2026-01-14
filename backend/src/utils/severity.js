const SEVERITY_ORDER = ['Low', 'Medium', 'High', 'Critical'];

function normalizeSeverity(value = 'Medium') {
  const normalized = value ? value.toLowerCase() : 'medium';
  const match = SEVERITY_ORDER.find(
    (level) => level.toLowerCase() === normalized
  );
  return match || 'Medium';
}

function severityRank(value = 'Medium') {
  return SEVERITY_ORDER.indexOf(normalizeSeverity(value));
}

module.exports = {
  normalizeSeverity,
  severityRank,
  SEVERITY_ORDER,
};

