// Vercel Serverless Function - AI Chat
// 部署在 Vercel 上，API Key 安全存储在服务端环境变量中

export const config = {
  runtime: 'nodejs',
}

// AI 调用核心逻辑
async function callAI(messages, options = {}) {
  const provider = process.env.AI_PROVIDER || 'deepseek'
  const temperature = options.temperature ?? 0.7
  const maxTokens = options.maxTokens ?? 2000

  let apiKey, baseUrl, model

  if (provider === 'openai') {
    apiKey = process.env.OPENAI_API_KEY
    baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
    model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  } else if (provider === 'deepseek') {
    apiKey = process.env.DEEPSEEK_API_KEY
    baseUrl = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1'
    model = process.env.DEEPSEEK_MODEL || 'deepseek-chat'
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`)
  }

  if (!apiKey || apiKey.includes('your-') || apiKey === '') {
    // Demo mode - return mock responses
    return getMockResponse(messages)
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
    const errorText = await response.text()
    throw new Error(`AI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

// Mock responses for demo mode
function getMockResponse(messages) {
  const lastMessage = messages[messages.length - 1]?.content || ''

  if (lastMessage.includes('你好') || lastMessage.includes('hi') || lastMessage.includes('hello')) {
    return '你好！我是你的人生观察员 AI 👋\n\n我可以帮你：\n• 分析你的人生数据和趋势\n• 发现潜在的风险和问题\n• 追踪目标进度和偏离\n• 提供基于数据的洞察\n\n你可以问我任何关于你的人生数据的问题。记住，我只是观察员，最终决定由你做出。'
  }

  if (lastMessage.includes('偏离') || lastMessage.includes('目标')) {
    return '让我看看你的目标情况...\n\n**客观事实**\n- 你当前有 3 个活跃目标\n- 其中"提升销售能力"进度 65%，按计划推进中\n- "每月存款2000元"进度 40%，略低于预期\n- 过去7天在客户开发上投入约8小时\n\n**AI 推断**\n- 职业能力目标推进良好，说明你在工作中投入较多\n- 财富目标可能需要关注支出控制\n- 按当前进度，月度存款目标可能只能完成约60-70%\n\n**风险提示**\n- 如果不注意支出管理，月底可能无法达成存款目标\n- 时间投入与目标重要性基本匹配，但效率可能有提升空间\n\n**未知信息**\n- 缺乏本月详细支出分类数据，无法定位具体消费问题\n- 不清楚你的职业满意度变化趋势'
  }

  if (lastMessage.includes('累') || lastMessage.includes('疲惫') || lastMessage.includes('精力') || lastMessage.includes('状态')) {
    return '关于你最近的状态...\n\n**客观事实**\n- 过去 7 天你记录了 5 天工作时长超过 9 小时\n- 运动记录仅有 0 次\n- 睡眠平均时长约 6.5 小时\n- 最近一周精力评分从7分下降到5分\n\n**AI 推断**\n- 你当前处于高投入状态，短期可以维持\n- 但长期来看，运动和睡眠不足可能影响持续战斗力\n- 自由时间减少可能影响整体幸福感\n\n**风险提示**\n- 连续高强度工作可能导致 burnout 风险\n- 缺乏运动可能影响身体状态和精力恢复\n\n**建议**\n- 你可能需要考虑：是否可以调整工作节奏，给身体一点恢复时间？\n- 记住：长期成长是马拉松，不是冲刺。'
  }

  if (lastMessage.includes('能力') || lastMessage.includes('成长')) {
    return '让我分析一下你的能力成长情况...\n\n**客观事实**\n- 当前你有 7 项被追踪的能力\n- 销售能力等级 L3（独立完成），近30天提升了1级\n- 客户开发能力 L3，谈判能力 L2\n- 近30天新增 5 条能力证据\n- 学习转化率约 60%（学习的内容中有60%实际应用了）\n\n**AI 推断**\n- 你正处于商业能力快速积累期\n- 销售相关能力提升明显，与职业目标一致\n- 学习方向比较聚焦，没有太分散\n\n**风险提示**\n- 能力提升主要集中在职业相关，其他维度（如创造、人际）投入较少\n- 可能存在能力结构单一的风险\n\n**未知信息**\n- 缺乏软技能的具体数据\n- 没有足够的360度反馈来验证能力自评的准确性'
  }

  return '我理解你的问题。基于你当前的数据，我想分享一些观察：\n\n**客观事实**\n- 你正处于 22 岁的能力资本积累期\n- 你在职业和能力上的投入较多\n- 你有清晰的长期目标方向\n- 财富增长稳定但速度偏缓\n\n**AI 推断**\n- 你当前的路径与长期目标基本一致\n- 在某些维度上可能需要更多平衡\n- 能力积累的势头良好\n\n**风险提示**\n- 工作投入过高可能影响生活平衡\n- 运动数据偏少，长期需关注精力可持续性\n\n**记住**\n- 我所有的分析都基于你记录的数据\n- 数据不足时我会明确说明\n- 最终的人生判断和决定，都取决于你自己'
}

function buildSystemPrompt(context) {
  let prompt = `你是 Life OS 的 AI 人生观察员。

核心原则：
1. 你不替用户做人生决定
2. 你基于数据说话，不编造信息
3. 你区分：客观事实 / AI 推断 / 风险提示 / 未知信息
4. 你关注长期趋势、目标偏离、能力积累
5. 你不用绝对语气，使用"可能"、"数据显示"、"值得注意"等措辞
6. 你尊重用户的价值观和选择

你的职责是帮助用户看清自己、理解现实，而不是指挥用户的人生。`

  if (context) {
    prompt += `\n\n用户背景数据（仅供参考，不要直接复述所有数据）：\n${JSON.stringify(context)}`
  }

  return prompt
}

export default async function handler(req, res) {
  // CORS
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
    const { messages, context } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' })
    }

    const systemPrompt = buildSystemPrompt(context)
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ]

    const response = await callAI(fullMessages, {
      temperature: 0.7,
      maxTokens: 2000,
    })

    res.json({
      success: true,
      content: response,
      provider: process.env.AI_PROVIDER || 'deepseek',
    })
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'AI service error',
    })
  }
}
