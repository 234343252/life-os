// Vercel Serverless Function - AI Config
// 注意：Vercel Serverless 是无状态的，配置通过环境变量管理
// 此接口仅返回当前配置状态，不返回真实 API Key

export const config = {
  runtime: 'nodejs',
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    // 返回当前配置状态（不返回真实 Key）
    const provider = process.env.AI_PROVIDER || 'deepseek'
    const hasOpenAIKey = !!(process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-') && process.env.OPENAI_API_KEY !== '')
    const hasDeepSeekKey = !!(process.env.DEEPSEEK_API_KEY && !process.env.DEEPSEEK_API_KEY.includes('your-') && process.env.DEEPSEEK_API_KEY !== '')

    return res.json({
      success: true,
      provider,
      hasOpenAIKey,
      hasDeepSeekKey,
      openai: {
        baseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      },
      deepseek: {
        baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      },
      demoMode: provider === 'deepseek' ? !hasDeepSeekKey : !hasOpenAIKey,
    })
  }

  if (req.method === 'POST') {
    // Vercel 无状态环境下，动态修改配置不可行
    // 返回提示：请通过 Vercel 环境变量管理配置
    return res.status(400).json({
      success: false,
      error: '部署在 Vercel 上时，请在 Vercel 后台的 Environment Variables 中配置 API Key。\n\n设置步骤：\n1. 进入 Vercel 项目 → Settings → Environment Variables\n2. 添加 AI_PROVIDER = deepseek (或 openai)\n3. 添加 DEEPSEEK_API_KEY = 你的key (或 OPENAI_API_KEY)\n4. 保存后重新部署即可生效',
    })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
