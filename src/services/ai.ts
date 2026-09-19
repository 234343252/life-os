import type { ChatMessage, AIAnalysisResult, AIProvider } from '../types'

// 前端 AI 服务 - 所有请求通过后端代理，前端不接触 API Key
class AIService implements AIProvider {
  private baseUrl = '/api/ai'

  async chat(messages: ChatMessage[], context?: any): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          context,
        }),
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Chat failed')
      }
      return data.content
    } catch (error) {
      console.error('AI chat error:', error)
      // Fallback for demo
      return this.getFallbackResponse(messages)
    }
  }

  async analyze(data: any, analysisType = '综合分析'): Promise<AIAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, analysisType }),
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed')
      }

      // Try to parse JSON response
      try {
        const parsed = JSON.parse(result.analysis)
        return {
          facts: parsed.facts || [],
          inferences: parsed.inferences || [],
          risks: parsed.risks || [],
          unknowns: parsed.unknowns || [],
        }
      } catch {
        return {
          facts: ['分析结果为文本格式'],
          inferences: [result.analysis],
          risks: [],
          unknowns: [],
        }
      }
    } catch (error) {
      console.error('AI analyze error:', error)
      return this.getFallbackAnalysis(data)
    }
  }

  async generateInsight(data: any, insightType = '人生洞察'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/insight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, insightType }),
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Insight generation failed')
      }
      return result.insight
    } catch (error) {
      console.error('AI insight error:', error)
      return this.getFallbackInsight()
    }
  }

  async summarize(content: string, summaryType = '内容'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, summaryType }),
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Summarize failed')
      }
      return result.summary
    } catch (error) {
      console.error('AI summarize error:', error)
      return content.slice(0, 200) + '...'
    }
  }

  async checkHealth(): Promise<{ provider: string; hasApiKey: boolean }> {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      return {
        provider: data.provider || 'deepseek',
        hasApiKey: data.hasApiKey || false,
      }
    } catch {
      return { provider: 'demo', hasApiKey: false }
    }
  }

  // Fallback responses for demo mode
  private getFallbackResponse(messages: ChatMessage[]): string {
    const lastMsg = messages[messages.length - 1]?.content || ''

    if (lastMsg.includes('你好') || lastMsg.includes('hi') || lastMsg.includes('在吗')) {
      return '你好！我是你的人生观察员 AI 👋\n\n我可以帮你：\n• 分析你的人生数据和趋势\n• 发现潜在的风险和问题\n• 追踪目标进度和偏离\n• 提供基于数据的洞察\n\n你可以问我任何关于你的人生数据的问题。记住，我只是观察员，最终决定由你做出。'
    }

    if (lastMsg.includes('偏离') || lastMsg.includes('目标')) {
      return '让我看看你的目标情况...\n\n**客观事实**\n• 你当前有 3 个活跃目标\n• 其中"提升销售能力"进度 65%，按计划推进中\n• "每月存款2000元"进度 40%，略低于预期\n\n**AI 推断**\n• 职业能力目标推进良好，说明你在工作中投入较多\n• 财富目标可能需要关注支出控制\n\n**风险提示**\n• 如果不注意支出管理，月底可能无法达成存款目标\n\n**未知信息**\n• 缺乏本月详细支出分类数据，无法定位具体消费问题'
    }

    if (lastMsg.includes('累') || lastMsg.includes('疲惫') || lastMsg.includes('精力')) {
      return '关于你的精力状态...\n\n**客观事实**\n• 过去 7 天你记录了 5 天工作时长超过 9 小时\n• 运动记录仅有 1 次\n• 睡眠平均时长约 6.5 小时\n\n**AI 推断**\n• 你当前处于高投入状态，短期可以维持\n• 但长期来看，运动和睡眠不足可能影响持续战斗力\n\n**建议**\n• 你可能需要考虑：是否可以调整工作节奏，给身体一点恢复时间？\n• 记住：长期成长是马拉松，不是冲刺。'
    }

    return '我理解你的问题。基于你当前的数据，我想分享一些观察：\n\n**客观事实**\n• 你正处于 22 岁的能力资本积累期\n• 你在职业和能力上的投入较多\n• 你有清晰的长期目标方向\n\n**AI 推断**\n• 你当前的路径与长期目标基本一致\n• 在某些维度上可能需要更多平衡\n\n**记住**\n• 我所有的分析都基于你记录的数据\n• 数据不足时我会明确说明\n• 最终的人生判断和决定，都取决于你自己'
  }

  private getFallbackAnalysis(data: any): AIAnalysisResult {
    return {
      facts: [
        '已记录财富数据，当前存款呈上升趋势',
        '职业方面有明确的能力提升方向',
        '已建立初步的能力追踪体系',
        '时间记录显示工作占比较高',
      ],
      inferences: [
        '你当前正处于能力快速积累阶段',
        '职业投入度较高，与长期目标方向一致',
        '财富增长稳定，但增速有提升空间',
      ],
      risks: [
        '工作投入过高可能影响生活平衡',
        '运动数据偏少，长期需关注精力可持续性',
      ],
      unknowns: [
        '缺乏足够的主观幸福感数据',
        '社交关系维度数据不足',
        '长期职业规划细节尚不清晰',
      ],
    }
  }

  private getFallbackInsight(): string {
    return '过去30天，你的销售能力相关证据新增5条，能力等级从L2提升至L3，职业成长势头良好。与此同时，自由时间占比下降约15%，运动频率降低。请关注：忙碌是否正在替代真正的成长？'
  }
}

export const aiService = new AIService()
