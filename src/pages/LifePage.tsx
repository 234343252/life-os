import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import Card, { CardHeader, CardTitle, CardContent } from '../components/Card'
import Modal from '../components/Modal'
import Button from '../components/Button'
import SkillTree from '../components/SkillTree'
import IncomeSourceMap from '../components/IncomeSourceMap'
import type { IncomeStage } from '../components/IncomeSourceMap'
import {
  calculateWealthFreedom,
  formatWealthFreedom,
  getSkillLevelLabel,
  formatDate,
} from '../utils'
import type { Goal, GoalPeriod, Skill, Income, Expense } from '../types'

type TabKey = 'vision' | 'goals' | 'wealth' | 'career' | 'skills'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'vision', label: '愿景' },
  { key: 'goals', label: '目标' },
  { key: 'wealth', label: '财富' },
  { key: 'career', label: '职业' },
  { key: 'skills', label: '能力' },
]

const periodLabels: Record<GoalPeriod, string> = {
  '10year': '10年',
  '5year': '5年',
  '3year': '3年',
  '1year': '1年',
  quarter: '季度',
  month: '月',
  week: '周',
  today: '今日',
}

const periodOrder: GoalPeriod[] = [
  '10year', '5year', '3year', '1year', 'quarter', 'month', 'week', 'today',
]

const incomeSourceLabels: Record<string, string> = {
  salary: '工资',
  bonus: '奖金',
  commission: '提成',
  sideJob: '副业',
  business: '生意',
  investment: '投资',
  other: '其他',
}

const expenseCategoryOptions = ['房租', '餐饮', '交通', '购物', '娱乐', '学习', '医疗', '其他']

export default function LifePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('vision')
  const { state } = useApp()
  const { visions, goals, incomes, expenses, assets, liabilities, careers, skills } = state

  return (
    <div className="flex flex-col min-h-full">
      {/* 顶部 Tab */}
      <div className="sticky top-0 z-30 bg-neutral-50 px-4 pt-2 pb-3">
        <div className="flex gap-1 bg-neutral-100 rounded-xl p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-4 pb-5 flex-1">
        {activeTab === 'vision' && <VisionTab visions={visions} />}
        {activeTab === 'goals' && <GoalsTab goals={goals} />}
        {activeTab === 'wealth' && (
          <WealthTab
            incomes={incomes}
            expenses={expenses}
            assets={assets}
            liabilities={liabilities}
          />
        )}
        {activeTab === 'career' && <CareerTab careers={careers} />}
        {activeTab === 'skills' && <SkillsTab skills={skills} />}
      </div>
    </div>
  )
}

// ============ 愿景 Tab ============
function VisionTab({ visions }: { visions: any[] }) {
  const activeVision = useMemo(
    () => visions.find(v => v.isActive) || visions[0],
    [visions]
  )

  const visionItems = [
    { key: 'wantToHave', label: '我想拥有', icon: '💎' },
    { key: 'wantToBe', label: '我想成为', icon: '🌟' },
    { key: 'wantToExperience', label: '我想体验', icon: '🌈' },
    { key: 'wantToCreate', label: '我想创造', icon: '🎨' },
    { key: 'wantToProvide', label: '我想提供', icon: '💝' },
    { key: 'absolutelyDontWant', label: '绝对不想', icon: '🚫' },
  ] as const

  if (!activeVision) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-neutral-400 text-sm">还没有设定人生愿景</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
        <CardContent>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-green-600 font-medium">
              第 {activeVision.version} 版愿景
            </span>
            <span className="text-xs text-neutral-400">·</span>
            <span className="text-xs text-neutral-400">
              {activeVision.year}年 · {activeVision.age}岁
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {visionItems.map(item => {
          const content = activeVision[item.key]
          return (
            <Card key={item.key}>
              <CardContent>
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500 mb-1">{item.label}</p>
                    <p className="text-sm text-neutral-800 leading-relaxed">
                      {content || '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ============ 目标 Tab ============
function GoalsTab({ goals }: { goals: Goal[] }) {
  const groupedGoals = useMemo(() => {
    const groups: Record<GoalPeriod, Goal[]> = {
      '10year': [], '5year': [], '3year': [], '1year': [],
      quarter: [], month: [], week: [], today: [],
    }
    goals.forEach(g => {
      if (groups[g.period]) {
        groups[g.period].push(g)
      }
    })
    return groups
  }, [goals])

  const hasAnyGoals = goals.length > 0

  if (!hasAnyGoals) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-neutral-400 text-sm">还没有设定目标</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {periodOrder.map(period => {
        const periodGoals = groupedGoals[period]
        if (periodGoals.length === 0) return null
        return (
          <div key={period}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-xs font-semibold text-neutral-500">
                {periodLabels[period]}
              </span>
              <span className="text-xs text-neutral-300">
                {periodGoals.length} 个目标
              </span>
            </div>
            <div className="space-y-2">
              {periodGoals.map(goal => (
                <Card key={goal.id} hoverable>
                  <CardContent>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-sm font-medium text-neutral-800 flex-1">
                        {goal.title}
                      </h4>
                      <span className={`tag ${
                        goal.status === 'active' ? 'tag-green' :
                        goal.status === 'completed' ? 'tag-neutral' :
                        'tag-amber'
                      }`}>
                        {goal.status === 'active' ? '进行中' :
                         goal.status === 'completed' ? '已完成' :
                         goal.status === 'paused' ? '暂停' : '已取消'}
                      </span>
                    </div>
                    {/* 进度条 */}
                    <div className="mb-1.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-400">进度</span>
                        <span className="text-xs font-medium text-green-600">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    {goal.nextAction && (
                      <p className="text-xs text-neutral-500 mt-2">
                        下一步：{goal.nextAction}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============ 财富 Tab ============
function WealthTab({
  incomes,
  expenses,
  assets,
  liabilities,
}: {
  incomes: Income[]
  expenses: Expense[]
  assets: any[]
  liabilities: any[]
}) {
  const { addIncome, addExpense } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [addType, setAddType] = useState<'income' | 'expense'>('income')
  const [addAmount, setAddAmount] = useState('')
  const [addCategory, setAddCategory] = useState('salary')
  const [addDescription, setAddDescription] = useState('')
  const [addDate, setAddDate] = useState(formatDate(new Date()))

  // 计算本月收入
  const monthlyIncome = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    return incomes
      .filter(i => {
        const d = new Date(i.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      .reduce((sum, i) => sum + i.amount, 0)
  }, [incomes])

  // 计算本月支出
  const monthlyExpense = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    return expenses
      .filter(e => {
        const d = new Date(e.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
      })
      .reduce((sum, e) => sum + e.amount, 0)
  }, [expenses])

  // 总资产
  const totalAssets = useMemo(
    () => assets.reduce((sum: number, a: any) => sum + a.value, 0),
    [assets]
  )

  // 总负债
  const totalLiabilities = useMemo(
    () => liabilities.reduce((sum: number, l: any) => sum + l.amount, 0),
    [liabilities]
  )

  // 净资产
  const netWorth = totalAssets - totalLiabilities

  // 存款（简化：用总资产估算）
  const savings = totalAssets > 0 ? totalAssets : 0

  // 财富自由度（生存缓冲）
  const wealthFreedomMonths = calculateWealthFreedom(savings, monthlyExpense || 1)

  // 收入来源地图 - 根据已有收入来源判断阶段
  const incomeStages: IncomeStage[] = useMemo(() => {
    const hasSalary = incomes.some(i => i.source === 'salary')
    const hasCommission = incomes.some(i => i.source === 'commission')
    const hasSideJob = incomes.some(i => i.source === 'sideJob')
    const hasBusiness = incomes.some(i => i.source === 'business')
    const hasInvestment = incomes.some(i => i.source === 'investment')

    // 确定当前阶段
    let currentStage = 0
    if (hasInvestment) currentStage = 7
    else if (hasBusiness) currentStage = 5
    else if (hasSideJob) currentStage = 3
    else if (hasCommission) currentStage = 2
    else if (hasSalary) currentStage = 1

    const stages: IncomeStage[] = [
      {
        key: 'labor',
        label: '劳动收入',
        description: '通过出卖时间和体力获得收入，是大多数人的起点。',
        icon: '💪',
        achieved: true,
        current: currentStage === 0,
      },
      {
        key: 'professional',
        label: '专业能力',
        description: '通过专业技能提升收入，从单纯劳动转向技能变现。',
        icon: '🎯',
        achieved: hasSalary,
        current: currentStage === 1,
      },
      {
        key: 'highValueService',
        label: '高价值服务',
        description: '提供高单价的专业服务，单位时间价值大幅提升。',
        icon: '💎',
        achieved: hasCommission,
        current: currentStage === 2,
      },
      {
        key: 'sideJob',
        label: '副业收入',
        description: '在主业之外开拓第二收入来源，开始分散收入风险。',
        icon: '🌱',
        achieved: hasSideJob,
        current: currentStage === 3,
      },
      {
        key: 'business',
        label: '商业收入',
        description: '通过商业模式和团队创造收入，不再依赖个人时间。',
        icon: '🏢',
        achieved: hasBusiness,
        current: currentStage === 4 || currentStage === 5,
      },
      {
        key: 'product',
        label: '产品收入',
        description: '通过可复制的产品获得收入，边际成本趋近于零。',
        icon: '📦',
        achieved: hasBusiness,
        current: false,
      },
      {
        key: 'asset',
        label: '资产收入',
        description: '通过持有资产产生被动收入，如房产、知识产权等。',
        icon: '🏠',
        achieved: hasInvestment,
        current: currentStage === 6,
      },
      {
        key: 'capital',
        label: '资本收入',
        description: '通过资本运作获得收入，让钱为你工作。',
        icon: '💰',
        achieved: hasInvestment,
        current: currentStage === 7,
      },
    ]

    return stages
  }, [incomes])

  // 最近6个月存款趋势（模拟数据）
  const savingsTrend = useMemo(() => {
    const months: { label: string; savings: number }[] = []
    const now = new Date()
    let cumulativeSavings = savings - monthlyIncome * 2 // 倒推起点

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthLabel = `${d.getMonth() + 1}月`

      // 模拟每月储蓄变化
      const monthIncome = incomes.filter(inc => {
        const incDate = new Date(inc.date)
        return incDate.getMonth() === d.getMonth() && incDate.getFullYear() === d.getFullYear()
      }).reduce((sum, inc) => sum + inc.amount, 0)

      const monthExpense = expenses.filter(exp => {
        const expDate = new Date(exp.date)
        return expDate.getMonth() === d.getMonth() && expDate.getFullYear() === d.getFullYear()
      }).reduce((sum, exp) => sum + exp.amount, 0)

      cumulativeSavings += (monthIncome || monthlyIncome * 0.8) - (monthExpense || monthlyExpense * 0.9)

      months.push({
        label: monthLabel,
        savings: Math.max(0, Math.round(cumulativeSavings)),
      })
    }

    // 确保最后一个月是当前存款
    if (months.length > 0) {
      months[months.length - 1].savings = savings
    }

    return months
  }, [incomes, expenses, savings, monthlyIncome, monthlyExpense])

  const statItems = [
    { label: '月收入', value: monthlyIncome, color: 'text-green-600', icon: '📈' },
    { label: '月支出', value: monthlyExpense, color: 'text-amber-600', icon: '📉' },
    { label: '存款', value: savings, color: 'text-blue-600', icon: '💰' },
    { label: '净资产', value: netWorth, color: 'text-emerald-600', icon: '💎' },
  ]

  // 财富自由度阶段
  const getFreedomStage = (months: number) => {
    if (months < 1) return { level: 0, label: '危险', color: 'text-red-500', bgColor: 'bg-red-50', barColor: 'from-red-400 to-red-500' }
    if (months < 3) return { level: 1, label: '紧张', color: 'text-amber-500', bgColor: 'bg-amber-50', barColor: 'from-amber-400 to-amber-500' }
    if (months < 6) return { level: 2, label: '一般', color: 'text-yellow-600', bgColor: 'bg-yellow-50', barColor: 'from-yellow-400 to-yellow-500' }
    if (months < 12) return { level: 3, label: '安全', color: 'text-green-500', bgColor: 'bg-green-50', barColor: 'from-green-400 to-green-600' }
    return { level: 4, label: '自由', color: 'text-emerald-600', bgColor: 'bg-emerald-50', barColor: 'from-emerald-500 to-emerald-700' }
  }

  const freedomStage = getFreedomStage(wealthFreedomMonths)

  const handleAddSubmit = () => {
    const amount = parseFloat(addAmount)
    if (isNaN(amount) || amount <= 0) return

    const now = new Date().toISOString()

    if (addType === 'income') {
      addIncome({
        amount,
        source: addCategory as Income['source'],
        description: addDescription,
        date: addDate,
      })
    } else {
      addExpense({
        amount,
        category: addCategory,
        description: addDescription,
        date: addDate,
        isFixed: false,
      })
    }

    // 重置表单
    setAddAmount('')
    setAddDescription('')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-4">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-neutral-900">财富管理</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md shadow-green-200 hover:bg-green-600 active:bg-green-700 transition-colors"
          aria-label="添加收入/支出"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* 财富概览 */}
      <Card>
        <CardHeader>
          <CardTitle>财富概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {statItems.map(item => (
              <div key={item.label} className="p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-xs text-neutral-500">{item.label}</span>
                </div>
                <p className={`text-lg font-semibold ${item.color}`}>
                  ¥{item.value.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 财富自由度卡片 */}
      <Card className={`border-green-200 ${freedomStage.bgColor}`}>
        <CardHeader>
          <CardTitle className="text-green-700 text-sm">财富自由度</CardTitle>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${freedomStage.color} bg-white/60`}>
            {freedomStage.label}
          </span>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold text-green-600">
                {formatWealthFreedom(wealthFreedomMonths)}
              </span>
            </div>
            <p className="text-sm text-neutral-600">
              如果今天失去收入，可以维持 {formatWealthFreedom(wealthFreedomMonths)}
            </p>
          </div>

          {/* 分阶段进度条 */}
          <div className="space-y-1.5 mb-3">
            <div className="flex h-3 rounded-full overflow-hidden bg-white/50">
              {[
                { threshold: 1, label: '危险' },
                { threshold: 3, label: '紧张' },
                { threshold: 6, label: '一般' },
                { threshold: 12, label: '安全' },
                { threshold: 24, label: '自由' },
              ].map((stage, idx) => {
                const prevThreshold = idx === 0 ? 0 : [1, 3, 6, 12, 24][idx - 1]
                const stageWidth = ((stage.threshold - prevThreshold) / 12) * 100
                const filled = Math.min(
                  Math.max(0, (wealthFreedomMonths - prevThreshold) / (stage.threshold - prevThreshold)) * 100,
                  100
                )
                const isActive = wealthFreedomMonths >= prevThreshold

                return (
                  <div
                    key={stage.label}
                    className="relative"
                    style={{ width: `${stageWidth}%` }}
                  >
                    <div
                      className={`h-full transition-all duration-500 ${
                        isActive
                          ? idx <= freedomStage.level
                            ? 'bg-gradient-to-r from-green-400 to-green-600'
                            : 'bg-neutral-200'
                          : 'bg-neutral-200'
                      }`}
                      style={{ width: isActive ? `${filled}%` : '0%' }}
                    />
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between text-xs text-neutral-500">
              <span>0</span>
              <span>3月</span>
              <span>6月</span>
              <span>12月+</span>
            </div>
          </div>

          {/* 阶段说明 */}
          <div className="grid grid-cols-5 gap-1 text-center">
            {[
              { label: '危险', months: '<1月' },
              { label: '紧张', months: '1-3月' },
              { label: '一般', months: '3-6月' },
              { label: '安全', months: '6-12月' },
              { label: '自由', months: '>12月' },
            ].map((s, idx) => (
              <div key={s.label} className={`text-[10px] ${
                idx === freedomStage.level ? 'text-green-700 font-medium' : 'text-neutral-400'
              }`}>
                <p>{s.label}</p>
                <p className="opacity-70">{s.months}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 财富趋势图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">存款趋势</CardTitle>
          <span className="text-xs text-neutral-400">近6个月</span>
        </CardHeader>
        <CardContent>
          <WealthTrendChart data={savingsTrend} />
        </CardContent>
      </Card>

      {/* 收入来源地图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">收入来源地图</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeSourceMap stages={incomeStages} />
        </CardContent>
      </Card>

      {/* 添加收入/支出弹窗 */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="添加记录"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" block onClick={() => setShowAddModal(false)}>
              取消
            </Button>
            <Button block onClick={handleAddSubmit}>
              确认添加
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* 类型切换 */}
          <div className="flex gap-2 p-1 bg-neutral-100 rounded-lg">
            <button
              onClick={() => {
                setAddType('income')
                setAddCategory('salary')
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                addType === 'income'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-neutral-500'
              }`}
            >
              收入
            </button>
            <button
              onClick={() => {
                setAddType('expense')
                setAddCategory('餐饮')
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                addType === 'expense'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-neutral-500'
              }`}
            >
              支出
            </button>
          </div>

          {/* 金额 */}
          <div>
            <label className="text-sm text-neutral-700 mb-1.5 block">金额</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">¥</span>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="0.00"
                className="input pl-8 text-lg font-semibold"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* 分类 */}
          <div>
            <label className="text-sm text-neutral-700 mb-1.5 block">分类</label>
            <div className="flex flex-wrap gap-2">
              {addType === 'income'
                ? (['salary', 'bonus', 'commission', 'sideJob', 'business', 'investment', 'other'] as const).map(src => (
                    <button
                      key={src}
                      onClick={() => setAddCategory(src)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                        addCategory === src
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-green-300'
                      }`}
                    >
                      {incomeSourceLabels[src]}
                    </button>
                  ))
                : expenseCategoryOptions.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setAddCategory(cat)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                        addCategory === cat
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-amber-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="text-sm text-neutral-700 mb-1.5 block">描述（可选）</label>
            <input
              type="text"
              value={addDescription}
              onChange={(e) => setAddDescription(e.target.value)}
              placeholder="简单描述一下..."
              className="input"
            />
          </div>

          {/* 日期 */}
          <div>
            <label className="text-sm text-neutral-700 mb-1.5 block">日期</label>
            <input
              type="date"
              value={addDate}
              onChange={(e) => setAddDate(e.target.value)}
              className="input"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ============ 财富趋势折线图 ============
function WealthTrendChart({ data }: { data: { label: string; savings: number }[] }) {
  const width = 320
  const height = 140
  const padding = { top: 20, right: 10, bottom: 25, left: 40 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const values = data.map(d => d.savings)
  const maxVal = Math.max(...values) * 1.15
  const minVal = Math.min(...values) * 0.85
  const range = maxVal - minVal || 1

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth
    const y = padding.top + chartHeight - ((d.savings - minVal) / range) * chartHeight
    return { x, y, value: d.savings, label: d.label }
  })

  // 生成平滑曲线路径
  const smoothPath = points.reduce((path, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`
    const prev = points[i - 1]
    const cpx1 = prev.x + (point.x - prev.x) / 3
    const cpy1 = prev.y
    const cpx2 = point.x - (point.x - prev.x) / 3
    const cpy2 = point.y
    return `${path} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point.x} ${point.y}`
  }, '')

  // 区域填充路径
  const areaPath = `${smoothPath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
      </defs>

      {/* 网格线 */}
      {[0, 0.5, 1].map((ratio, i) => {
        const y = padding.top + chartHeight * ratio
        return (
          <line
            key={i}
            x1={padding.left}
            y1={y}
            x2={width - padding.right}
            y2={y}
            stroke="#e5e5e5"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )
      })}

      {/* Y轴标签 */}
      {[0, 0.5, 1].map((ratio, i) => {
        const y = padding.top + chartHeight * ratio
        const value = Math.round(maxVal - range * ratio)
        return (
          <text
            key={i}
            x={padding.left - 5}
            y={y + 3}
            textAnchor="end"
            fontSize="9"
            fill="#a3a3a3"
          >
            {value >= 10000 ? `${(value / 10000).toFixed(1)}万` : value}
          </text>
        )
      })}

      {/* 区域填充 */}
      <path d={areaPath} fill="url(#areaGradient)" />

      {/* 折线 */}
      <path
        d={smoothPath}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 数据点 */}
      {points.map((point, i) => (
        <g key={i}>
          <circle cx={point.x} cy={point.y} r="5" fill="white" stroke="#22c55e" strokeWidth="2" />
          <circle cx={point.x} cy={point.y} r="2" fill="#22c55e" />
        </g>
      ))}

      {/* X轴标签 */}
      {points.map((point, i) => (
        <text
          key={i}
          x={point.x}
          y={height - padding.bottom + 18}
          textAnchor="middle"
          fontSize="10"
          fill="#737373"
        >
          {point.label}
        </text>
      ))}
    </svg>
  )
}

// ============ 职业 Tab ============
function CareerTab({ careers }: { careers: any[] }) {
  const currentCareer = useMemo(
    () => careers.find(c => c.isCurrent),
    [careers]
  )

  if (!currentCareer) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-neutral-400 text-sm">暂无当前职业信息</p>
        </CardContent>
      </Card>
    )
  }

  const companyAssets = [
    { key: 'salary', label: '薪资收入' },
    { key: 'platform', label: '平台背书' },
    { key: 'clients', label: '客户资源' },
    { key: 'resources', label: '团队支持' },
    { key: 'training', label: '培训机会' },
  ]

  const portableCategories = [
    { key: 'skills', label: '技能' },
    { key: 'methods', label: '方法论' },
    { key: 'cases', label: '案例' },
    { key: 'industryKnowledge', label: '行业认知' },
    { key: 'connections', label: '人脉' },
    { key: 'personalBrand', label: '个人品牌' },
    { key: 'clientRelationships', label: '客户关系' },
  ]

  // 解析 portableAssets 和 companyAssets 字符串为数组
  const parseAssetList = (str: string): string[] => {
    if (!str) return []
    return str.split(/[、，,；;\n]+/).filter(Boolean)
  }

  const portableSkills = currentCareer.skillsGained || []
  const companyAssetList = parseAssetList(currentCareer.companyAssets)

  return (
    <div className="space-y-4">
      {/* 当前职业信息 */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
        <CardContent>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-neutral-900">
                {currentCareer.position}
              </h3>
              <p className="text-sm text-neutral-600 mt-0.5">
                {currentCareer.company}
              </p>
            </div>
            <span className="tag tag-green">在职</span>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-green-100">
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600">
                ¥{currentCareer.income}
              </p>
              <p className="text-xs text-neutral-500">月薪</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-700">
                {currentCareer.workHours}h
              </p>
              <p className="text-xs text-neutral-500">日工作时长</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-neutral-700">
                {currentCareer.industry}
              </p>
              <p className="text-xs text-neutral-500">行业</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 工作内容 */}
      <Card>
        <CardHeader>
          <CardTitle>工作内容</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {currentCareer.workContent}
          </p>
        </CardContent>
      </Card>

      {/* 职业资产 */}
      <Card>
        <CardHeader>
          <CardTitle>职业资产</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 公司给的 */}
          <div>
            <p className="text-xs text-neutral-500 mb-2 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-neutral-400" />
              公司赋予的（离开就失去）
            </p>
            <div className="flex flex-wrap gap-1.5">
              {companyAssetList.length > 0 ? (
                companyAssetList.map((item: string, idx: number) => (
                  <span key={idx} className="tag tag-neutral">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-400">—</span>
              )}
            </div>
          </div>

          {/* 可以带走的 */}
          <div>
            <p className="text-xs text-green-600 mb-2 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-500" />
              可以带走的（真正属于你）
            </p>
            <div className="space-y-2">
              {/* 技能 */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">技能</p>
                <div className="flex flex-wrap gap-1.5">
                  {portableSkills.length > 0 ? (
                    portableSkills.map((skill: string, idx: number) => (
                      <span key={idx} className="tag tag-green">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-400">—</span>
                  )}
                </div>
              </div>
              {/* 资源 */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">资源与认知</p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {currentCareer.resourcesGained || '—'}
                </p>
              </div>
              {/* 人脉 */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">人脉</p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {currentCareer.connectionsGained || '—'}
                </p>
              </div>
              {/* 行业认知 */}
              <div>
                <p className="text-xs text-neutral-400 mb-1">行业认知</p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {currentCareer.industryKnowledge || '—'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 风险与局限 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-amber-600">风险与局限</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-xs text-neutral-400 mb-1">局限</p>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {currentCareer.limitations || '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-neutral-400 mb-1">风险</p>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {currentCareer.risks || '—'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============ 能力 Tab ============
function SkillsTab({ skills }: { skills: Skill[] }) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  const skillLevelColor = (level: number) => {
    if (level >= 6) return 'bg-green-600 text-white'
    if (level >= 4) return 'bg-green-500 text-white'
    if (level >= 2) return 'bg-green-400 text-white'
    return 'bg-green-200 text-green-700'
  }

  if (skills.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-neutral-400 text-sm">还没有记录任何能力</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* 能力树可视化 */}
      <Card className="bg-gradient-to-b from-green-50/50 to-white">
        <CardHeader>
          <CardTitle className="text-sm">我的能力树</CardTitle>
          <span className="text-xs text-neutral-400">
            共 {skills.length} 项能力
          </span>
        </CardHeader>
        <CardContent className="px-1">
          <SkillTree
            skills={skills}
            onSkillClick={(skill) => setSelectedSkill(skill)}
          />
        </CardContent>
      </Card>

      {/* 能力详情弹窗 */}
      <Modal
        open={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        title="能力详情"
      >
        {selectedSkill && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                {selectedSkill.name}
              </h3>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${skillLevelColor(selectedSkill.level)}`}>
                L{selectedSkill.level}
              </span>
            </div>

            <div>
              <p className="text-xs text-neutral-500 mb-1">等级说明</p>
              <p className="text-sm text-neutral-700">
                {getSkillLevelLabel(selectedSkill.level)}
              </p>
            </div>

            {selectedSkill.description && (
              <div>
                <p className="text-xs text-neutral-500 mb-1">描述</p>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {selectedSkill.description}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-neutral-500 mb-1">分类</p>
              <span className="tag tag-green">{selectedSkill.category}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* 能力等级说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xs text-neutral-500">能力等级说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {Array.from({ length: 8 }, (_, i) => i).map(level => (
              <div key={level} className="flex items-center gap-2">
                <span className={`text-xs w-7 text-center py-0.5 rounded ${skillLevelColor(level)}`}>
                  L{level}
                </span>
                <span className="text-xs text-neutral-500">
                  {getSkillLevelLabel(level)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
