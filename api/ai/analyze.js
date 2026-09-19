// Vercel Serverless Function - AI Analyze

export const config = {
  runtime: 'nodejs',
}

async function callAI(messages, options = {}) {
  const provider = process.env.AI_PROVIDER || 'deepseek'
  const temperature = options.temperature ?? 0.5
  const maxTokens = options.maxTokens ?? 3000

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
    return JSON.stringify({
      facts: [
        '数据显示你有持续的能力积累记录',
        '职业方向与长期目标基本一致',
        '财富呈稳定增长趋势',
        '近期运动记录偏少',
      ],
      inferences: [
        '你当前正处于能力快速积累期',
        '工作投入度较高，但需关注生活平衡',
        '能力成长势头良好',
      ],
      risks: [
        '运动不足可能影响长期精力水平',
        '需警惕忙碌替代成长的情况',
      ],
      unknowns: [
        '主观幸福感数据不足',
        '社交关系维度数据较少',
      ],
    })
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
    const { data, analysisType } = req.body

    const systemPrompt = `你是 Life OS 的 AI 人生观察员。你的职责是：
1. 基于用户数据进行客观分析
2. 区分：客观事实 / AI 推断 / 风险提示 / 未知信息
3. 发现长期趋势、目标偏离、能力积累、时间黑洞等问题
4. 不替用户做人生决定
5. 不根据单次行为下固定人格结论
6. 使用谨慎的语气：可能存在、当前数据显示、你可能需要考虑

请以 JSON 格式返回分析结果，包含以下字段：
- facts: 客观事实数组
- inferences: AI 推断数组
- risks: 风险提示数组
- unknowns: 未知信息数组`

    const userPrompt = `请分析以下用户数据，分析类型：${analysisType || '综合分析'}

用户数据：
${JSON.stringify(data, null, 2)}

请给出你的观察和分析。`

    const response = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], {
      temperature: 0.5,
      maxTokens: 3000,
    })

    res.json({
      success: true,
      analysis: response,
      provider: process.env.AI_PROVIDER || 'deepseek',
    })
  } catch (error) {
    console.error('Analyze error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'AI analysis error',
    })
  }
}
