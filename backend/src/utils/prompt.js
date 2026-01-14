const promptTemplate = `You are an expert site reliability engineer specializing in production incident triage.
Analyze the provided application log snippet and respond STRICTLY in minified JSON with the following keys:
{
  "issueType": "<short classification>",
  "rootCause": "<2-3 sentence explanation>",
  "suggestedFix": "<actionable remediation steps>",
  "severity": "<one of: Low | Medium | High | Critical>"
}

Rules:
- Be concise (max 100 words overall).
- Infer severity from impact.
- If information is insufficient, set "issueType": "Unknown" and severity "Medium".
- Do NOT include markdown fences or commentary.`;

function buildAnalysisPrompt(maskedLog) {
  return `${promptTemplate}\n\nLog:\n${maskedLog}`;
}

module.exports = {
  buildAnalysisPrompt,
};

