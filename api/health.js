// Vercel Serverless Function - Health Check

export const config = {
  runtime: 'nodejs',
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const provider = process.env.AI_PROVIDER || 'deepseek'
  const hasOpenAIKey = !!(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-') && process.env.OPENAI_API_KEY !== '')
  const hasDeepSeekKey = !!(process.env.DEEPSEEK_API_KEY && !process.env.DEEPSEEK_API_KEY.includes('your-') && process.env.DEEPSEEK_API_KEY !== '')

  res.json({
    status: 'ok',
    provider,
    hasApiKey: provider === 'deepseek' ? hasDeepSeekKey : hasOpenAIKey,
    demoMode: provider === 'deepseek' ? !hasDeepSeekKey : !hasOpenAIKey,
  })
}
