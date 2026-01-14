const OpenAI = require('openai');
const config = require('../config/env');
const { buildAnalysisPrompt } = require('../utils/prompt');

let client;

function getClient() {
  if (!config.openAiKey) {
    throw new Error('OpenAI API key missing');
  }
  if (!client) {
    client = new OpenAI({ apiKey: config.openAiKey });
  }
  return client;
}

function extractJson(text = '') {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('LLM response missing JSON payload');
  }
  return JSON.parse(jsonMatch[0]);
}

async function analyzeLog(maskedLog) {
  const prompt = buildAnalysisPrompt(maskedLog);
  const response = await getClient().responses.create({
    model: config.openAiModel,
    input: prompt,
    temperature: 0.2,
  });

  const message = response.output?.[0]?.content?.[0]?.text || response.output_text;
  if (!message) {
    throw new Error('Empty response from OpenAI');
  }

  const parsed = extractJson(message);
  return {
    issueType: parsed.issueType || 'Unknown',
    rootCause: parsed.rootCause || 'Not enough information.',
    suggestedFix: parsed.suggestedFix || 'Gather more diagnostics.',
    severity: parsed.severity || 'Medium',
    raw: message,
  };
}

module.exports = {
  analyzeLog,
};

