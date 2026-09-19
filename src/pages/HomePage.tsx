import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import TrendBadge from '../components/TrendBadge'
import { getCurrentAge, getLifeStage, getSkillLevelLabel } from '../utils'
import type { Task, LifeStatus, AIInsight } from '../types'

const urgencyConfig = {
  high: { label: '紧急', className: 'bg-red-50 text-red-600' },
  medium: { label: '一般', className: 'bg-amber-50 text-amber-600' },
  low: { label: '不急', className: 'bg-neutral-100 text-neutral-500' },
}

function calculateLifeStatus(
  incomes: any[],
  expenses: any[],
  careers: any[],
  skills: any[],
  bodyMetrics: any[],
  interests: any[],
  selfAlignments: any[]
): LifeStatus {
  // 财富趋势
  const recentIncome = incomes.slice(-2).reduce((sum, i) => sum + i.amount, 0)
  const olderIncome = incomes.slice(-4, -2).reduce((sum, i) => sum + i.amount, 0)
  const wealthTrend = recentIncome > olderIncome ? 'up' : recentIncome < olderIncome ? 'down' : 'stable'
  const wealthValue = recentIncome > 0 ? Math.round((recentIncome / (olderIncome || 1) - 1) * 100) : 0

  // 职业趋势
  const currentCareer = careers.find(c => c.isCurrent)
  const careerTrend = currentCareer ? 'up' : 'stable'
  const careerValue = currentCareer ? currentCareer.income : 0

  // 能力趋势
  const skillLevels = skills.map(s => s.level)
  const avgSkillLevel = skillLevels.length > 0 ? Math.round(skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length * 10) / 10 : 0
  const skillTrend = 'up'

  // 身体趋势
  const recentBody = bodyMetrics.slice(-1)[0]
  const olderBody = bodyMetrics.slice(-3, -2)[0]
  let bodyTrend: 'up' | 'down' | 'stable' = 'stable'
  let bodyValue = 0
  if (recentBody && olderBody) {
    if (recentBody.energyLevel && olderBody.energyLevel) {
      bodyTrend = recentBody.energyLevel > olderBody.energyLevel ? 'up'
        : recentBody.energyLevel < olderBody.energyLevel ? 'down' : 'stable'
      bodyValue = recentBody.energyLevel
    }
  } else if (recentBody?.energyLevel) {
    bodyValue = recentBody.energyLevel
  }

  // 兴趣趋势
  const interestTrend = interests.length > 0 ? 'stable' : 'stable'
  const interestValue = interests.length

  // 自我一致性趋势
  const latestAlignment = selfAlignments[selfAlignments.length - 1]
  const selfAlignmentTrend = latestAlignment ? (latestAlignment.score >= 70 ? 'up' : latestAlignment.score >= 50 ? 'stable' : 'down') : 'stable'
  const selfAlignmentValue = latestAlignment?.score || 0

  return {
    wealth: { trend: wealthTrend, value: wealthValue },
    career: { trend: careerTrend, value: careerValue },
    skills: { trend: skillTrend, value: avgSkillLevel },
    body: { trend: bodyTrend, value: bodyValue },
    interests: { trend: interestTrend, value: interestValue },
    selfAlignment: { trend: selfAlignmentTrend, value: selfAlignmentValue },
  }
}

const statusDimensions = [
  { key: 'wealth', label: '财富', unit: '%' },
  { key: 'career', label: '职业', unit: '元' },
  { key: 'skills', label: '能力', unit: '级' },
  { key: 'body', label: '身体', unit: '分' },
  { key: 'interests', label: '兴趣', unit: '项' },
  { key: 'selfAlignment', label: '自我一致', unit: '分' },
] as const

export default function HomePage() {
  const navigate = useNavigate()
  const { state, toggleTask } = useApp()
  const { user, tasks, aiInsights, incomes, expenses, careers, skills, bodyMetrics, interests, selfAlignments, notifications } = state

  const age = useMemo(() => getCurrentAge(user?.birthDate), [user?.birthDate])
  const lifeStage = useMemo(() => user?.currentStage || getLifeStage(age), [user?.currentStage, age])
  const currentYear = new Date().getFullYear()

  // 今日最重要的3件事（按优先级排序取前3）
  const todayTopTasks = useMemo(() => {
    return [...tasks]
      .filter(t => !t.completed)
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3)
  }, [tasks])

  // 人生状态
  const lifeStatus = useMemo(
    () => calculateLifeStatus(incomes, expenses, careers, skills, bodyMetrics, interests, selfAlignments),
    [incomes, expenses, careers, skills, bodyMetrics, interests, selfAlignments]
  )

  // AI今日观察（取最新的1-3条）
  const todayInsights = useMemo(() => {
    return [...aiInsights]
      .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      .slice(0, 3)
  }, [aiInsights])

  // 今日人生提醒
  const observerReminder = useMemo(() => {
    if (notifications.length > 0) {
      const unread = notifications.find(n => !n.read)
      if (unread) return unread.message
    }
    return '保持节奏，每天进步一点点。'
  }, [notifications])

  // AI主线文字
  const mainStoryline = useMemo(() => {
    const activeGoals = state.goals.filter(g => g.status === 'active')
    if (activeGoals.length > 0) {
      const topGoal = activeGoals[0]
      return `当前主线：${topGoal.title} —— ${topGoal.whyImportant}`
    }
    return '探索自我，积累能力，为未来的可能性打下基础。'
  }, [state.goals])

  return (
    <div className="px-4 py-5 space-y-5">
      {/* 人生阶段卡片 */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
        <CardContent>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-green-700">{age}岁</span>
            <span className="text-neutral-400">·</span>
            <span className="text-lg text-neutral-600">{currentYear}</span>
            <span className="text-neutral-400">·</span>
            <span className="text-sm font-medium text-green-600 bg-green-100/60 px-2 py-0.5 rounded-full">
              {lifeStage}
            </span>
          </div>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {mainStoryline}
          </p>
        </CardContent>
      </Card>

      {/* 今日最重要的3件事 */}
      <Card>
        <CardHeader>
          <CardTitle>今日最重要的3件事</CardTitle>
          <span className="text-xs text-neutral-400">
            {todayTopTasks.filter(t => t.completed).length}/{todayTopTasks.length}
          </span>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayTopTasks.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-4">今天没有待办任务</p>
          ) : (
            todayTopTasks.map((task: Task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  task.completed ? 'bg-neutral-50' : 'hover:bg-neutral-50 active:bg-neutral-100'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    task.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-neutral-300 hover:border-green-400'
                  }`}
                >
                  {task.completed && (
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.completed ? 'text-neutral-400 line-through' : 'text-neutral-800'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {task.goalTitle && (
                      <span className="text-xs text-neutral-500 truncate max-w-[120px]">
                        🎯 {task.goalTitle}
                      </span>
                    )}
                    {task.relatedSkills && task.relatedSkills.length > 0 && (
                      <span className="text-xs text-neutral-400">
                        ⚡ {task.relatedSkills.slice(0, 2).join('、')}
                      </span>
                    )}
                    <span className={`tag ${urgencyConfig[task.urgency].className} text-xs`}>
                      {urgencyConfig[task.urgency].label}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* 今日人生提醒 */}
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="text-green-700 text-sm flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            AI Observer · 今日提醒
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {observerReminder}
          </p>
        </CardContent>
      </Card>

      {/* 人生状态 */}
      <Card>
        <CardHeader>
          <CardTitle>人生状态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {statusDimensions.map(dim => {
              const status = lifeStatus[dim.key]
              return (
                <div key={dim.key} className="text-center p-3 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1.5">{dim.label}</p>
                  <TrendBadge
                    direction={status.trend}
                    value={status.value}
                    unit={dim.unit}
                    size="sm"
                    className="justify-center"
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI今日观察 */}
      <Card>
        <CardHeader>
          <CardTitle>AI 今日观察</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {todayInsights.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-4">暂无洞察</p>
          ) : (
            todayInsights.map((insight: AIInsight) => (
              <div key={insight.id} className="p-3 bg-neutral-50 rounded-xl">
                <h4 className="text-sm font-semibold text-neutral-800 mb-1.5">
                  {insight.title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {insight.content}
                </p>
                {insight.dataSources && insight.dataSources.length > 0 && (
                  <p className="text-xs text-neutral-400 mt-2">
                    数据来源：{insight.dataSources.join(' · ')}
                  </p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* AI 对话悬浮按钮 */}
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full bg-green-600 text-white shadow-elevated hover:bg-green-700 transition-all flex items-center justify-center z-40 active:scale-95"
        aria-label="AI 对话"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  )
}
