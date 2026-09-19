// Vercel Serverless Function - AI Insight

export const config = {
  runtime: 'nodejs',
}

async function callAI(messages, options = {}) {
  const provider = process.env.AI_PROVIDER || 'deepseek'
  const temperature = options.temperature ?? 0.6
  const maxTokens = options.maxTokens ?? 1500

  let apiKey, baseUrl, model

  if (provider === 'openai') {
    apiKey = process.env.OPENAI_API_KEY
    baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  } else {
    apiKey = process.env.DEEPSEEK_API_KEY
    baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'
    model = process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  }

  if (!apiKey || apiKey.includes('your-') || apiKey === '') {
    return '过去30天，你的销售能力增长明显，新增了5条能力证据。但与此同时，运动记录持续为0，自由时间占比下降约15%。请关注：忙碌是否正在替代真正的成长？'
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    }),
  })

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { data, insightType } = req.body

    const systemPrompt = `你是 Life OS 的 AI 观察员。请基于用户数据生成1-3条深刻的洞察。
要求：
- 每条洞察必须基于真实数据
- 关注长期趋势而非短期波动
- 关注行为与目标的一致性
- 语言简洁有力
- 不要使用泛泛的鼓励语`

    const userPrompt = `请基于以下数据生成${insightType || '人生洞察'}：

${JSON.stringify(data, null, 2)}`

    const response = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.6,
      maxTokens: 1500,
    })

    res.json({
      success: true,
      insight: response,
      provider: process.env.AI_PROVIDER || 'deepseek',
    })
  } catch (error) {
    console.error('Insight error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'AI insight error',
    })
  }
}
