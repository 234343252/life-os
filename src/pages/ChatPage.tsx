import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { aiService } from '../services/ai'
import { formatRelativeTime } from '../utils'
import type { ChatMessage } from '../types'

// AI 消息解析后的分段
interface ParsedMessage {
  intro?: string
  sections: {
    type: 'fact' | 'inference' | 'risk' | 'unknown' | 'suggestion'
    title: string
    items: string[]
  }[]
  outro?: string
}

export default function ChatPage() {
  const { state, addChatMessage } = useApp()
  const { chatHistory, user } = state
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, loading])

  // 构建用户数据上下文
  const buildUserContext = () => {
    // 精简数据，只发送关键摘要
    return {
      user: {
        name: user?.name,
        age: user?.birthDate ? new Date().getFullYear() - new Date(user.birthDate).getFullYear() : undefined,
        currentStage: user?.currentStage,
      },
      summary: {
        goals: state.goals.filter(g => g.status === 'active').length,
        projects: state.projects.filter(p => p.status === 'active').length,
        skills: state.skills.length,
        decisions: state.decisions.length,
        careers: state.careers.length,
        recentLogs: state.dailyLogs.slice(-7).length,
      },
      recentActivity: {
        latestGoals: state.goals.slice(-3).map(g => ({ title: g.title, progress: g.progress })),
        latestProjects: state.projects.slice(-3).map(p => ({ name: p.name, status: p.status })),
        topSkills: [...state.skills].sort((a, b) => b.level - a.level).slice(0, 5).map(s => ({ name: s.name, level: s.level })),
      },
    }
  }

  // 发送消息
  const handleSend = async () => {
    const content = input.trim()
    if (!content || loading) return

    // 添加用户消息
    addChatMessage({
      role: 'user',
      content,
    })
    setInput('')
    setLoading(true)

    try {
      // 构建消息历史
      const messages: ChatMessage[] = [
        {
          id: 'system',
          role: 'assistant',
          content: '你是一位专业的人生观察员 AI。你的职责是基于用户提供的人生数据，给出客观、审慎、有洞察的分析。\n\n回答格式要求：\n- 先简要回应用户的问题\n- 用"**客观事实**"标记基于数据的事实陈述\n- 用"**AI 推断**"标记基于事实的合理推测\n- 用"**风险提示**"标记潜在的风险或问题\n- 用"**未知信息**"标记数据不足无法判断的部分\n\n请始终保持谦逊，明确区分事实和推断，不要过度解读有限的数据。',
          timestamp: new Date().toISOString(),
        },
        ...chatHistory.slice(-20), // 保留最近20条消息
        {
          id: 'temp-user',
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        },
      ]

      const context = buildUserContext()
      const response = await aiService.chat(messages, context)

      // 添加 AI 回复
      addChatMessage({
        role: 'assistant',
        content: response,
      })
    } catch (error) {
      console.error('Chat error:', error)
      addChatMessage({
        role: 'assistant',
        content: '抱歉，我遇到了一些问题，请稍后再试。',
      })
    } finally {
      setLoading(false)
    }
  }

  // 键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 快捷问题
  const quickQuestions = [
    '我最近的状态怎么样？',
    '我的目标有偏离吗？',
    '分析一下我的能力成长',
    '给我一些建议',
  ]

  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 safe-top">
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-soft">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-neutral-900">和我的人生谈谈</h1>
              <p className="text-xs text-neutral-500">AI 观察员 · 基于你的人生数据分析</p>
            </div>
          </div>
        </div>
      </header>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
          {chatHistory.length === 0 && (
            <WelcomeCard quickQuestions={quickQuestions} onSelect={(q) => setInput(q)} />
          )}

          {chatHistory.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {loading && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部输入框 */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-100 safe-bottom">
        <div className="max-w-lg mx-auto px-3 py-3">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="和你的人生数据对话..."
                rows={1}
                className="textarea pr-10 min-h-[44px] max-h-32 text-sm"
                style={{ resize: 'none' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`
                flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center
                transition-all duration-200
                ${input.trim() && !loading
                  ? 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 shadow-soft'
                  : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                }
              `}
              aria-label="发送"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ 欢迎卡片 ============
function WelcomeCard({ quickQuestions, onSelect }: { quickQuestions: string[]; onSelect: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 shadow-soft">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">你好，我是你的人生观察员</h3>
      <p className="text-sm text-neutral-500 text-center max-w-xs mb-6">
        我会基于你记录的人生数据，提供客观的分析和洞察。
        <br />
        记住，我只是观察员，最终决定由你做出。
      </p>
      <div className="w-full space-y-2">
        <p className="text-xs text-neutral-400 mb-2">试试问我：</p>
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className="w-full text-left px-4 py-3 bg-white border border-neutral-100 rounded-xl text-sm text-neutral-700 transition-all duration-200 hover:border-green-200 hover:bg-green-50 hover:text-green-700 shadow-soft"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============ 消息气泡 ============
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="flex items-end gap-2 max-w-[85%]">
          <span className="text-xs text-neutral-400 mb-1 flex-shrink-0">
            {formatRelativeTime(message.timestamp)}
          </span>
          <div className="bg-green-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md shadow-soft">
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
          </div>
        </div>
      </div>
    )
  }

  // AI 消息
  const parsed = parseAIMessage(message.content)

  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex items-start gap-2 max-w-[90%]">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="bg-white border border-neutral-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-soft">
            {parsed.intro && (
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap break-words mb-3">
                {parsed.intro}
              </p>
            )}

            {parsed.sections.length > 0 && (
              <div className="space-y-3">
                {parsed.sections.map((section, i) => (
                  <MessageSection key={i} type={section.type} title={section.title} items={section.items} />
                ))}
              </div>
            )}

            {parsed.outro && (
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap break-words mt-3 pt-3 border-t border-neutral-100">
                {parsed.outro}
              </p>
            )}

            {/* 如果没有解析出分段，直接显示原文 */}
            {parsed.sections.length === 0 && !parsed.intro && !parsed.outro && (
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}
          </div>
          <span className="text-xs text-neutral-400 mt-1 ml-1">
            {formatRelativeTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============ 消息分段 ============
function MessageSection({
  type,
  title,
  items,
}: {
  type: 'fact' | 'inference' | 'risk' | 'unknown' | 'suggestion'
  title: string
  items: string[]
}) {
  const styleMap = {
    fact: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-800',
      tagBg: 'bg-green-100',
      tagText: 'text-green-700',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
    inference: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-800',
      tagBg: 'bg-amber-100',
      tagText: 'text-amber-700',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10c0-2.5-.5-4.5-2-6.5S14.5 2 12 2z" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    risk: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-800',
      tagBg: 'bg-red-100',
      tagText: 'text-red-700',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    unknown: {
      bg: 'bg-neutral-50',
      border: 'border-neutral-200',
      text: 'text-neutral-700',
      tagBg: 'bg-neutral-200',
      tagText: 'text-neutral-600',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    suggestion: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      text: 'text-green-800',
      tagBg: 'bg-green-100',
      tagText: 'text-green-700',
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
        </svg>
      ),
    },
  }

  const style = styleMap[type]

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-3`}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${style.tagBg} ${style.tagText}`}>
          {style.icon}
          {title}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className={`text-sm ${style.text} leading-relaxed flex gap-2`}>
            <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full bg-current opacity-60" />
            <span className="break-words">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============ 打字指示器 ============
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-soft">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>
        <div className="bg-white border border-neutral-100 px-4 py-3 rounded-2xl rounded-tl-md shadow-soft">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ============ AI 消息解析 ============
function parseAIMessage(content: string): ParsedMessage {
  const sections: ParsedMessage['sections'] = []
  let intro = ''
  let outro = ''

  // 定义要匹配的节标题及其类型
  const sectionPatterns: { pattern: RegExp; type: 'fact' | 'inference' | 'risk' | 'unknown' | 'suggestion'; title: string }[] = [
    { pattern: /\*\*客观事实\*\*/, type: 'fact', title: '客观事实' },
    { pattern: /\*\*事实\*\*/, type: 'fact', title: '客观事实' },
    { pattern: /\*\*AI 推断\*\*/, type: 'inference', title: 'AI 推断' },
    { pattern: /\*\*AI推断\*\*/, type: 'inference', title: 'AI 推断' },
    { pattern: /\*\*推断\*\*/, type: 'inference', title: 'AI 推断' },
    { pattern: /\*\*风险提示\*\*/, type: 'risk', title: '风险提示' },
    { pattern: /\*\*风险\*\*/, type: 'risk', title: '风险提示' },
    { pattern: /\*\*未知信息\*\*/, type: 'unknown', title: '未知信息' },
    { pattern: /\*\*未知\*\*/, type: 'unknown', title: '未知信息' },
    { pattern: /\*\*建议\*\*/, type: 'suggestion', title: '建议' },
  ]

  // 找到所有节的位置
  const foundSections: { index: number; type: 'fact' | 'inference' | 'risk' | 'unknown' | 'suggestion'; title: string; endIndex: number }[] = []

  for (const sp of sectionPatterns) {
    let match: RegExpExecArray | null
    const regex = new RegExp(sp.pattern.source, 'g')
    while ((match = regex.exec(content)) !== null) {
      foundSections.push({
        index: match.index,
        type: sp.type,
        title: sp.title,
        endIndex: match.index + match[0].length,
      })
    }
  }

  // 按位置排序
  foundSections.sort((a, b) => a.index - b.index)

  if (foundSections.length === 0) {
    // 没有找到分段，检查是否有简单的列表格式
    const lines = content.split('\n').filter(l => l.trim())
    if (lines.length > 1 && lines.some(l => l.startsWith('•') || l.startsWith('-'))) {
      // 尝试解析为简单的事实列表
      const items = lines
        .filter(l => l.startsWith('•') || l.startsWith('-'))
        .map(l => l.replace(/^[•\-]\s*/, '').trim())
        .filter(Boolean)

      if (items.length > 0) {
        intro = lines.filter(l => !l.startsWith('•') && !l.startsWith('-')).join('\n').trim()
        sections.push({ type: 'fact', title: '内容', items })
        return { intro, sections }
      }
    }

    return { intro: content, sections: [] }
  }

  // 提取 intro（第一段到第一个节之前）
  intro = content.slice(0, foundSections[0].index).trim()

  // 提取各个节的内容
  for (let i = 0; i < foundSections.length; i++) {
    const current = foundSections[i]
    const next = foundSections[i + 1]
    const sectionContent = content.slice(current.endIndex, next ? next.index : content.length).trim()

    // 解析列表项
    const items = parseListItems(sectionContent)

    if (items.length > 0) {
      sections.push({
        type: current.type,
        title: current.title,
        items,
      })
    }
  }

  // 检查是否有结尾段落（最后一个节之后的内容，如果不是列表项的话）
  const lastSection = foundSections[foundSections.length - 1]
  const afterLast = content.slice(lastSection.endIndex).trim()
  const lastItems = parseListItems(afterLast)
  const remainingText = afterLast
    .split('\n')
    .filter(l => l.trim() && !l.match(/^[•\-]\s*/))
    .join('\n')
    .trim()

  if (remainingText && remainingText.length > 10 && sections.length > 0) {
    outro = remainingText
  }

  return { intro: intro || undefined, sections, outro: outro || undefined }
}

// 解析列表项
function parseListItems(text: string): string[] {
  const lines = text.split('\n')
  const items: string[] = []
  let currentItem = ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      if (currentItem) {
        items.push(currentItem.trim())
        currentItem = ''
      }
      continue
    }

    if (trimmed.match(/^[•\-]\s*/)) {
      if (currentItem) {
        items.push(currentItem.trim())
      }
      currentItem = trimmed.replace(/^[•\-]\s*/, '')
    } else if (currentItem) {
      // 延续上一个列表项
      currentItem += ' ' + trimmed
    }
  }

  if (currentItem) {
    items.push(currentItem.trim())
  }

  return items.filter(item => item.length > 0)
}
