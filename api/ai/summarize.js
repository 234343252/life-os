// Vercel Serverless Function - AI Summarize

export const config = {
  runtime: 'nodejs',
}

async function callAI(messages, options = {}) {
  const provider = process.env.AI_PROVIDER || 'deepseek'
  const temperature = options.temperature ?? 0.3
  const maxTokens = options.maxTokens ?? 1000

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
    const content = messages[messages.length - 1]?.content || ''
    return content.slice(0, 200) + (content.length > 200 ? '...' : '')
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
    const { content, summaryType } = req.body

    const systemPrompt = `你是 Life OS 的 AI 助手。请对用户提供的内容进行总结提炼。
要求：
- 保留核心信息
- 结构清晰
- 客观准确
- 不添加原文没有的内容`

    const userPrompt = `请总结以下${summaryType || '内容'}：

${content}`

    const response = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.3,
      maxTokens: 1000,
    })

    res.json({
      success: true,
      summary: response,
      provider: process.env.AI_PROVIDER || 'deepseek',
    })
  } catch (error) {
    console.error('Summarize error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'AI summarize error',
    })
  }
}
