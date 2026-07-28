module.exports = {
  provider: process.env.AI_PROVIDER || 'hybrid',
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-4o-mini',
  maxTokens: 1500,
  temperature: 0.2
};
