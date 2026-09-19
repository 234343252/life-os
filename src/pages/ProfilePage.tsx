import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { getCurrentAge, getLifeStage } from '../utils'

interface MenuItem {
  icon: string
  label: string
  desc?: string
  badge?: string | number
  onClick?: () => void
  danger?: boolean
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const { user, values, careers, projects, decisions, skillEvidences, lifeVersions, chatHistory } = state
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetting, setResetting] = useState(false)

  const age = getCurrentAge(user?.birthDate)
  const stage = user?.currentStage || getLifeStage(age)

  // 动态生成个人画像标签
  const personaTags = generatePersonaTags(state)

  const handleReset = () => {
    setResetting(true)
    setTimeout(() => {
      dispatch({ type: 'RESET_STATE' })
      setResetting(false)
      setShowResetModal(false)
    }, 800)
  }

  const menuItems: MenuItem[] = [
    {
      icon: 'portrait',
      label: '个人画像',
      desc: '能力模式 · 决策风格 · 学习偏好',
      onClick: () => alert('个人画像功能开发中'),
    },
    {
      icon: 'values',
      label: '我的价值观',
      desc: values?.mostImportant?.slice(0, 3).join(' · ') || '尚未设置',
      onClick: () => alert('价值观功能开发中'),
    },
    {
      icon: 'archive',
      label: '人生档案',
      desc: `${careers.length}段工作 · ${projects.length}个项目 · ${decisions.length}次决策 · ${skillEvidences.length}条能力证据`,
      onClick: () => alert('人生档案功能开发中'),
    },
    {
      icon: 'memory',
      label: '和 AI 对话',
      desc: '基于你的人生数据分析、提问、复盘',
      onClick: () => navigate('/chat'),
    },
    {
      icon: 'version',
      label: '人生版本',
      desc: lifeVersions.length > 0 ? `当前 v${lifeVersions[lifeVersions.length - 1].version}` : '暂无版本记录',
      onClick: () => alert('人生版本功能开发中'),
    },
    {
      icon: 'export',
      label: '数据导出',
      desc: '导出全部人生数据 JSON',
      onClick: () => handleExport(),
    },
    {
      icon: 'settings',
      label: '设置',
      desc: 'AI 配置 · 数据管理',
      onClick: () => navigate('/settings'),
    },
    {
      icon: 'about',
      label: '关于 Life OS',
      desc: 'v0.1.0 · 你的人生操作系统',
      onClick: () => alert('Life OS v0.1.0\n\n一个帮助你系统化管理人生的工具。\n基于数据驱动的人生决策支持系统。'),
    },
  ]

  const handleExport = () => {
    const dataStr = JSON.stringify(state, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `life-os-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Layout title="我的">
      <div className="px-4 py-6 space-y-5">
        {/* 用户头像区域 */}
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl font-semibold shadow-soft">
                {user?.name?.charAt(0) || '?'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              {/* AI 对话入口按钮 */}
              <button
                onClick={() => navigate('/chat')}
                className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full border border-green-200 flex items-center justify-center text-green-600 shadow-soft hover:bg-green-50 hover:border-green-300 transition-colors"
                aria-label="和 AI 对话"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-neutral-900 truncate">
                {user?.name || '未命名用户'}
              </h2>
              <p className="text-sm text-neutral-500 mt-0.5">
                {age}岁 · {stage}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="tag tag-green">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  成长中
                </span>
              </div>
            </div>
            <button className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
        </Card>

        {/* 个人画像标签 */}
        <Card padding="lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-neutral-900">个人画像</h3>
            <span className="text-xs text-neutral-400">AI 动态生成</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {personaTags.map((tag, index) => (
              <span
                key={index}
                className={`tag ${tag.type === 'ability' ? 'tag-green' : tag.type === 'decision' ? 'tag-amber' : 'tag-neutral'}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </Card>

        {/* 功能列表 */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full bg-white border border-neutral-100 rounded-xl p-4 flex items-center gap-3 text-left transition-all duration-200 hover:shadow-card active:scale-[0.99] shadow-soft"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.danger ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
              }`}>
                <MenuIcon name={item.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${item.danger ? 'text-red-600' : 'text-neutral-900'}`}>
                  {item.label}
                </div>
                {item.desc && (
                  <div className="text-xs text-neutral-500 mt-0.5 truncate">{item.desc}</div>
                )}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 flex-shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))}
        </div>

        {/* 重置数据按钮 */}
        <div className="pt-4 pb-2">
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full py-3 text-sm text-red-500 font-medium bg-white border border-red-100 rounded-xl transition-all duration-200 hover:bg-red-50 active:bg-red-100 shadow-soft"
          >
            重置所有数据
          </button>
        </div>
      </div>

      {/* 重置确认弹窗 */}
      <Modal
        open={showResetModal}
        onClose={() => !resetting && setShowResetModal(false)}
        title="重置所有数据"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 leading-relaxed">
            此操作将删除所有本地存储的人生数据，包括目标、项目、能力记录、决策历史等。
            <br />
            <span className="text-red-500 font-medium">此操作不可撤销。</span>
          </p>
          <div className="bg-red-50 border border-red-100 rounded-lg p-3">
            <p className="text-xs text-red-600">
              ⚠️ 请确保已导出重要数据后再执行重置
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowResetModal(false)}
              disabled={resetting}
              className="flex-1 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg transition-colors hover:bg-neutral-200 disabled:opacity-50"
            >
              取消
            </button>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg transition-colors hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {resetting && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {resetting ? '重置中...' : '确认重置'}
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}

// ============ 个人画像标签生成 ============
function generatePersonaTags(state: ReturnType<typeof useApp>['state']): { label: string; type: 'ability' | 'decision' | 'learning' }[] {
  const tags: { label: string; type: 'ability' | 'decision' | 'learning' }[] = []
  const { skills, decisions, learnings, skillEvidences, projects } = state

  // 能力模式标签
  if (skills.length > 0) {
    const topSkill = [...skills].sort((a, b) => b.level - a.level)[0]
    if (topSkill) {
      tags.push({ label: `擅长${topSkill.category}`, type: 'ability' })
    }
    if (skills.filter(s => s.level >= 3).length >= 3) {
      tags.push({ label: '多能力复合型', type: 'ability' })
    }
  }
  if (skillEvidences.length >= 5) {
    tags.push({ label: '行动导向型', type: 'ability' })
  }
  if (projects.length >= 3) {
    tags.push({ label: '项目经验丰富', type: 'ability' })
  }

  // 决策风格标签
  if (decisions.length >= 3) {
    const hasReview = decisions.filter(d => d.actualResult).length
    if (hasReview >= 2) {
      tags.push({ label: '复盘型决策者', type: 'decision' })
    } else {
      tags.push({ label: '果断决策型', type: 'decision' })
    }
  }

  // 学习偏好标签
  if (learnings.length >= 5) {
    const appliedRate = learnings.filter(l => l.applied).length / learnings.length
    if (appliedRate >= 0.6) {
      tags.push({ label: '学以致用型', type: 'learning' })
    } else {
      tags.push({ label: '持续学习者', type: 'learning' })
    }
  }
  if (learnings.length >= 10) {
    tags.push({ label: '高学习投入', type: 'learning' })
  }

  // 默认标签（数据不足时）
  if (tags.length === 0) {
    tags.push(
      { label: '探索成长中', type: 'ability' },
      { label: '数据收集中', type: 'learning' },
    )
  }

  return tags.slice(0, 6)
}

// ============ 图标组件 ============
function MenuIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    portrait: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    values: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    archive: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
    memory: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    version: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    export: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    settings: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    about: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  }
  return icons[name] || icons.about
}
