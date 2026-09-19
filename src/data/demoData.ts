import type { AppState, User, Vision, Value, Goal, Task, Project, Skill, SkillEvidence, Career, Income, Expense, Experiment, Decision, BodyMetric, Interest, TimeLog, DailyLog, AIInsight, Notification, SubjectiveLife, SelfAlignment } from '../types'
import { formatDate, generateId } from '../utils'

const now = new Date()
const userId = 'demo-user'

function demoId(prefix: string, num: number): string {
  return `${prefix}-${num}`
}

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return formatDate(d)
}

function monthsAgo(months: number): string {
  const d = new Date()
  d.setMonth(d.getMonth() - months)
  return formatDate(d)
}

export function getDemoData(): Partial<AppState> {
  const user: User = {
    id: userId,
    userId,
    name: '小艾',
    birthDate: '2003-06-15',
    currentStage: '能力资本积累期',
    createdAt: monthsAgo(3),
    updatedAt: formatDate(now),
  }

  const vision: Vision = {
    id: demoId('vision', 1),
    userId,
    version: 1,
    year: 2025,
    age: 22,
    wantToHave: '拥有自己的事业、足够的财富自由、温馨的家',
    wantToBe: '有商业能力、有创造力、有温度的人',
    wantToExperience: '创业的过程、看世界、深度的人际关系',
    wantToCreate: '有价值的产品、帮助别人的服务、美的东西',
    wantToProvide: '给家人更好的生活、给客户真正的价值、给团队成长机会',
    absolutelyDontWant: '变成只有利益的人、过着重复无意义的生活、失去自我',
    isActive: true,
    createdAt: monthsAgo(2),
    updatedAt: monthsAgo(2),
  }

  const values: Value = {
    id: demoId('value', 1),
    userId,
    mostImportant: ['自由', '成长', '创造价值', '家人', '真诚'],
    cannotAccept: ['虚伪', '浪费生命', '被控制', '无意义的忙碌'],
    willingToWorkFor: ['长期能力积累', '财富自由', '自己的事业', '帮助家人'],
    notWillingToExchange: ['健康', '自我认同', '真正重要的关系'],
    createdAt: monthsAgo(2),
    updatedAt: monthsAgo(2),
  }

  const goals: Goal[] = [
    {
      id: demoId('goal', 1),
      userId,
      title: '月收入达到1万元',
      description: '通过主业+提成，在2026年底前月收入达到1万',
      type: 'result',
      period: '1year',
      deadline: '2026-12-31',
      progress: 52,
      successCriteria: '连续两个月税后收入≥10000元',
      whyImportant: '建立财富基础，为后续发展提供缓冲',
      relatedSkills: ['销售', '客户开发'],
      relatedWealth: '月收入',
      relatedLifeDirection: '财富基础',
      nextAction: '本月新增3个重点客户',
      status: 'active',
      createdAt: monthsAgo(2),
      updatedAt: daysAgo(3),
    },
    {
      id: demoId('goal', 2),
      userId,
      title: '独立完成复杂B2B谈判',
      description: '能够独立负责从客户开发到签约的全流程',
      type: 'ability',
      period: '1year',
      deadline: '2026-12-31',
      progress: 65,
      successCriteria: '独立完成3个以上客户的全流程销售',
      whyImportant: '核心商业能力，未来做任何生意都需要',
      relatedSkills: ['销售', '谈判', '用户理解'],
      relatedLifeDirection: '商业能力',
      nextAction: '下周独立跟进A客户的谈判',
      status: 'active',
      createdAt: monthsAgo(2),
      updatedAt: daysAgo(5),
    },
    {
      id: demoId('goal', 3),
      userId,
      title: '每月存款2000元',
      description: '建立储蓄习惯，积累第一桶金',
      type: 'result',
      period: 'month',
      deadline: formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
      progress: 40,
      successCriteria: '月底存款增加≥2000元',
      whyImportant: '财富基础的第一步',
      relatedSkills: ['财务管理'],
      relatedWealth: '存款',
      relatedLifeDirection: '财富基础',
      nextAction: '控制非必要支出',
      status: 'active',
      createdAt: daysAgo(15),
      updatedAt: daysAgo(2),
    },
  ]

  const today = formatDate(now)
  const tasks: Task[] = [
    {
      id: demoId('task', 1),
      userId,
      title: '联系3个重点客户',
      description: '跟进A/B/C三个客户的最新进展',
      goalId: demoId('goal', 2),
      goalTitle: '独立完成复杂B2B谈判',
      relatedSkills: ['销售', '客户开发'],
      longTermValue: '积累客户资源和销售经验',
      urgency: 'high',
      priority: 1,
      completed: false,
      dueDate: today,
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
    {
      id: demoId('task', 2),
      userId,
      title: '学习谈判技巧 1小时',
      description: '学习《优势谈判》第3章',
      goalId: demoId('goal', 2),
      goalTitle: '独立完成复杂B2B谈判',
      relatedSkills: ['谈判'],
      longTermValue: '提升核心销售能力',
      urgency: 'medium',
      priority: 2,
      completed: true,
      completedAt: daysAgo(0),
      dueDate: today,
      createdAt: daysAgo(2),
      updatedAt: daysAgo(0),
    },
    {
      id: demoId('task', 3),
      userId,
      title: '记录本周支出',
      description: '整理本周消费，分析可优化项',
      goalId: demoId('goal', 3),
      goalTitle: '每月存款2000元',
      relatedSkills: ['财务管理'],
      longTermValue: '建立理财意识和习惯',
      urgency: 'low',
      priority: 3,
      completed: false,
      dueDate: today,
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
  ]

  const projects: Project[] = [
    {
      id: demoId('proj', 1),
      userId,
      name: 'Q3新客户开发',
      goal: '本季度开发5个新客户，提升销售业绩',
      startDate: formatDate(new Date(now.getFullYear(), 6, 1)),
      endDate: formatDate(new Date(now.getFullYear(), 8, 30)),
      actions: ['客户名单筛选', 'Cold Call', '需求挖掘', '方案报价', '跟进谈判'],
      resources: '公司客户资源、销售培训',
      result: '已完成3个客户签约',
      income: 8000,
      skillsGained: ['客户开发', '需求分析', '报价谈判'],
      works: ['客户方案PPT', '竞品分析报告'],
      connections: ['客户A', '客户B', '客户C'],
      status: 'active',
      createdAt: monthsAgo(3),
      updatedAt: daysAgo(1),
    },
  ]

  const skills: Skill[] = [
    {
      id: demoId('skill', 1),
      userId,
      name: '销售',
      category: '商业能力',
      level: 3,
      description: 'B2B海外仓销售',
      createdAt: monthsAgo(3),
      updatedAt: daysAgo(7),
    },
    {
      id: demoId('skill', 2),
      userId,
      name: '客户开发',
      category: '商业能力',
      level: 3,
      parentId: demoId('skill', 1),
      createdAt: monthsAgo(3),
      updatedAt: daysAgo(5),
    },
    {
      id: demoId('skill', 3),
      userId,
      name: '谈判',
      category: '商业能力',
      level: 2,
      parentId: demoId('skill', 1),
      createdAt: monthsAgo(3),
      updatedAt: daysAgo(10),
    },
    {
      id: demoId('skill', 4),
      userId,
      name: '用户理解',
      category: '商业能力',
      level: 2,
      parentId: demoId('skill', 1),
      createdAt: monthsAgo(3),
      updatedAt: daysAgo(14),
    },
    {
      id: demoId('skill', 5),
      userId,
      name: '快速学习',
      category: '学习能力',
      level: 3,
      createdAt: monthsAgo(3),
      updatedAt: daysAgo(20),
    },
    {
      id: demoId('skill', 6),
      userId,
      name: '内容创作',
      category: '创造能力',
      level: 2,
      createdAt: monthsAgo(3),
      updatedAt: daysAgo(30),
    },
    {
      id: demoId('skill', 7),
      userId,
      name: '沟通',
      category: '人际能力',
      level: 3,
      createdAt: monthsAgo(3),
      updatedAt: daysAgo(15),
    },
  ]

  const skillEvidences: SkillEvidence[] = [
    {
      id: demoId('se', 1),
      userId,
      skillId: demoId('skill', 2),
      skillName: '客户开发',
      whatHappened: 'Q3季度主动开发新客户',
      whatIDid: '筛选了50个潜在客户，完成20个首次沟通，转化3个签约客户',
      result: '新增3个客户，贡献业绩约8000元提成',
      skillProven: '客户开发能力达到L3（独立完成）',
      skillToImprove: '谈判效率还有提升空间，平均谈判周期偏长',
      transferable: true,
      transferableIndustries: 'B2B销售相关行业均可迁移',
      projectId: demoId('proj', 1),
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
    {
      id: demoId('se', 2),
      userId,
      skillId: demoId('skill', 3),
      skillName: '谈判',
      whatHappened: '与A客户的价格谈判',
      whatIDid: '准备了3套方案，从价值角度切入而非单纯降价',
      result: '最终以95%的目标价格成交，客户满意度高',
      skillProven: '谈判能力从L2提升到L3',
      skillToImprove: '应对强硬对手时的策略选择',
      transferable: true,
      transferableIndustries: '任何涉及商务谈判的场景',
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10),
    },
  ]

  const careers: Career[] = [
    {
      id: demoId('career', 1),
      userId,
      company: '某海外仓公司',
      position: 'B2B销售',
      industry: '跨境物流',
      income: 5000,
      workHours: 9,
      workContent: '客户开发、需求对接、报价谈判、订单跟进',
      skillsGained: ['销售', '客户开发', '谈判', '行业认知'],
      resourcesGained: '行业客户资源、物流网络知识',
      connectionsGained: '同行、客户',
      industryKnowledge: '海外仓运作模式、跨境物流行业格局',
      clientsGained: '5个长期合作客户',
      portableAssets: '销售能力、客户关系、行业认知',
      companyAssets: '公司品牌、平台资源、团队支持',
      limitations: '底薪较低，收入依赖提成；晋升路径有限',
      risks: '行业波动大，客户稳定性一般',
      isCurrent: true,
      startDate: '2025-07-01',
      createdAt: monthsAgo(3),
      updatedAt: daysAgo(1),
    },
  ]

  const incomes: Income[] = [
    { id: demoId('inc', 1), userId, amount: 4900, source: 'salary', description: '7月基本工资', date: daysAgo(45), createdAt: daysAgo(45), updatedAt: daysAgo(45) },
    { id: demoId('inc', 2), userId, amount: 1200, source: 'commission', description: '6月提成', date: daysAgo(40), createdAt: daysAgo(40), updatedAt: daysAgo(40) },
    { id: demoId('inc', 3), userId, amount: 5100, source: 'salary', description: '8月基本工资', date: daysAgo(15), createdAt: daysAgo(15), updatedAt: daysAgo(15) },
    { id: demoId('inc', 4), userId, amount: 2500, source: 'commission', description: '7月提成', date: daysAgo(10), createdAt: daysAgo(10), updatedAt: daysAgo(10) },
  ]

  const expenses: Expense[] = [
    { id: demoId('exp', 1), userId, amount: 1400, category: '房租', description: '月房租', date: daysAgo(45), isFixed: true, createdAt: daysAgo(45), updatedAt: daysAgo(45) },
    { id: demoId('exp', 2), userId, amount: 1200, category: '餐饮', description: '7月日常吃饭', date: daysAgo(40), isFixed: false, createdAt: daysAgo(40), updatedAt: daysAgo(40) },
    { id: demoId('exp', 3), userId, amount: 300, category: '交通', description: '7月交通费用', date: daysAgo(38), isFixed: false, createdAt: daysAgo(38), updatedAt: daysAgo(38) },
    { id: demoId('exp', 4), userId, amount: 1400, category: '房租', description: '月房租', date: daysAgo(15), isFixed: true, createdAt: daysAgo(15), updatedAt: daysAgo(15) },
    { id: demoId('exp', 5), userId, amount: 1000, category: '餐饮', description: '8月日常吃饭', date: daysAgo(10), isFixed: false, createdAt: daysAgo(10), updatedAt: daysAgo(10) },
    { id: demoId('exp', 6), userId, amount: 500, category: '购物', description: '买衣服', date: daysAgo(8), isFixed: false, createdAt: daysAgo(8), updatedAt: daysAgo(8) },
  ]

  const experiments: Experiment[] = [
    {
      id: demoId('exp', 1),
      userId,
      title: '小红书内容副业实验',
      type: 'sideJob',
      hypothesis: '我可以通过小红书内容创作获得额外收入，同时锻炼内容能力',
      whyBelieve: '自己有审美和表达能力，小红书平台适合新人起步',
      period: '3个月',
      actions: '每周更新3篇笔记，学习爆款逻辑，尝试变现',
      cost: '每周约10小时，投入产出比待验证',
      successCriteria: '3个月内粉丝≥1000，或有变现尝试',
      data: '已更新12篇笔记，粉丝230，最高阅读量5000',
      status: 'ongoing',
      startDate: daysAgo(30),
      createdAt: daysAgo(30),
      updatedAt: daysAgo(2),
    },
    {
      id: demoId('exp', 2),
      userId,
      title: '早起运动实验',
      type: 'body',
      hypothesis: '每天早起运动30分钟可以提升全天精力',
      whyBelieve: '之前有过运动后状态好的体验',
      period: '30天',
      actions: '每天6:30起床，运动30分钟（跑步/瑜伽）',
      cost: '每天少睡30分钟',
      successCriteria: '坚持21天以上，精力评分提升≥2分',
      data: '坚持了10天，后面因为工作忙中断了',
      finalEvidence: '坚持的时候确实精力更好，但很难长期维持',
      conclusion: 'partial_support',
      status: 'completed',
      startDate: daysAgo(45),
      endDate: daysAgo(15),
      createdAt: daysAgo(45),
      updatedAt: daysAgo(15),
    },
  ]

  const decisions: Decision[] = [
    {
      id: demoId('dec', 1),
      userId,
      title: '选择B2B销售工作',
      category: '职业',
      thoughtsAtTheTime: '想积累商业能力，销售是最直接的方式',
      informationAtTheTime: '薪资4900+提成，行业是跨境物流，公司规模中等',
      prediction: '1年内可以积累客户资源和销售能力，为未来打基础',
      riskAssessment: '底薪低，压力大，但成长空间大',
      finalDecision: '接受这份工作',
      actualResult: '确实学到了很多，收入也在增长，但比想象中累',
      decisionDate: '2025-06-15',
      createdAt: daysAgo(90),
      updatedAt: daysAgo(30),
    },
  ]

  const bodyMetrics: BodyMetric[] = [
    { id: demoId('bm', 1), userId, date: daysAgo(30), weight: 52, sleepHours: 7.5, exerciseMinutes: 30, energyLevel: 7, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
    { id: demoId('bm', 2), userId, date: daysAgo(20), weight: 52, sleepHours: 6.5, exerciseMinutes: 0, energyLevel: 6, createdAt: daysAgo(20), updatedAt: daysAgo(20) },
    { id: demoId('bm', 3), userId, date: daysAgo(10), weight: 51.5, sleepHours: 6, exerciseMinutes: 0, energyLevel: 5, createdAt: daysAgo(10), updatedAt: daysAgo(10) },
    { id: demoId('bm', 4), userId, date: daysAgo(3), weight: 51.5, sleepHours: 7, exerciseMinutes: 0, energyLevel: 6, createdAt: daysAgo(3), updatedAt: daysAgo(3) },
  ]

  const interests: Interest[] = [
    { id: demoId('int', 1), userId, name: '阅读', category: 'growth', joyLevel: 8, growthLevel: 9, creativePotential: 5, businessPotential: 3, timeInvested: 20, emotionalValue: 7, createdAt: monthsAgo(2), updatedAt: daysAgo(5) },
    { id: demoId('int', 2), userId, name: '画画', category: 'creative', joyLevel: 9, growthLevel: 6, creativePotential: 9, businessPotential: 4, timeInvested: 10, emotionalValue: 9, createdAt: monthsAgo(2), updatedAt: daysAgo(15) },
    { id: demoId('int', 3), userId, name: '看剧', category: 'pure_enjoyment', joyLevel: 7, growthLevel: 2, creativePotential: 2, businessPotential: 1, timeInvested: 15, emotionalValue: 6, createdAt: monthsAgo(2), updatedAt: daysAgo(1) },
  ]

  const timeLogs: TimeLog[] = Array.from({ length: 14 }, (_, i) => ({
    id: demoId('tl', i + 1),
    userId,
    date: daysAgo(13 - i),
    category: ['work', 'work', 'work', 'study', 'body', 'entertainment', 'relationship', 'other'][i % 8] as any,
    duration: [480, 540, 500, 60, 0, 90, 60, 30][i % 8],
    createdAt: daysAgo(13 - i),
    updatedAt: daysAgo(13 - i),
  }))

  const dailyLogs: DailyLog[] = [
    {
      id: demoId('dl', 1),
      userId,
      date: daysAgo(3),
      whatHappened: '和A客户签了约，很开心',
      biggestGain: '完成了一个重要的客户签约，证明了自己的销售能力',
      biggestDrain: '准备合同和各种流程花了很多时间',
      whatMadeMeHappy: '客户说很认可我的专业度',
      whatToNotice: '签单后有一点松懈，要继续保持节奏',
      whatICompleted: '客户签约、跟进2个新线索',
      mood: '开心',
      tags: ['工作', '成就感'],
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
    {
      id: demoId('dl', 2),
      userId,
      date: daysAgo(7),
      whatHappened: '加班到很晚，感觉有点累',
      biggestGain: '推进了好几个客户的进度',
      biggestDrain: '太累了，回家后什么都不想做',
      whatMadeMeHappy: '同事点的奶茶',
      whatToNotice: '连续加班的话需要注意恢复',
      whatICompleted: '3个客户方案',
      mood: '疲惫',
      tags: ['工作', '疲惫'],
      createdAt: daysAgo(7),
      updatedAt: daysAgo(7),
    },
  ]

  const aiInsights: AIInsight[] = [
    {
      id: demoId('ai', 1),
      userId,
      type: 'weekly',
      title: '销售能力快速提升，但运动持续缺席',
      content: '过去30天，你的销售能力增长明显，新增了5条能力证据。但与此同时，运动记录持续为0，自由时间占比下降约15%。',
      facts: [
        '销售能力从L2提升至L3',
        '过去30天新增5条能力证据',
        '最近14天无运动记录',
        '日均工作时长从8小时增加到9.2小时',
      ],
      inferences: [
        '你当前正处于职业上升期，能力快速积累',
        '工作投入的增加可能在挤压运动和休闲时间',
      ],
      risks: [
        '长期缺乏运动可能影响精力和健康',
        '忙碌可能替代了真正的成长反思时间',
      ],
      unknowns: [
        '不清楚你的主观幸福感变化',
        '社交时间是否也被挤压尚不明确',
      ],
      dataSources: ['能力证据', '时间记录', '身体数据'],
      generatedAt: daysAgo(1),
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
    },
  ]

  const notifications: Notification[] = [
    {
      id: demoId('notif', 1),
      userId,
      type: 'attention',
      title: '本周运动次数为0',
      message: '你已经连续7天没有运动记录了，长期可能影响精力水平',
      priority: 'standard',
      read: false,
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
    {
      id: demoId('notif', 2),
      userId,
      type: 'action',
      title: '今日3个重点任务',
      message: '点击查看今天最重要的3件事',
      priority: 'light',
      read: true,
      createdAt: daysAgo(0),
      updatedAt: daysAgo(0),
    },
  ]

  const subjectiveLife: SubjectiveLife[] = [
    { id: demoId('sl', 1), userId, date: daysAgo(30), happiness: 7, freedom: 6, satisfaction: 6, security: 5, interest: 8, relationships: 7, selfIdentity: 7, energy: 7, environment: 6, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
    { id: demoId('sl', 2), userId, date: daysAgo(7), happiness: 6, freedom: 5, satisfaction: 6, security: 5, interest: 7, relationships: 6, selfIdentity: 7, energy: 5, environment: 6, createdAt: daysAgo(7), updatedAt: daysAgo(7) },
  ]

  const selfAlignments: SelfAlignment[] = [
    { id: demoId('sa', 1), userId, date: daysAgo(30), score: 72, behaviorAlignment: 70, valueAlignment: 75, goalAlignment: 78, timeAlignment: 65, note: '整体方向一致，但时间分配可以优化', createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  ]

  return {
    user,
    visions: [vision],
    values,
    goals,
    tasks,
    projects,
    skills,
    skillEvidences,
    careers,
    incomes,
    expenses,
    experiments,
    decisions,
    bodyMetrics,
    interests,
    timeLogs,
    dailyLogs,
    aiInsights,
    notifications,
    subjectiveLife,
    selfAlignments,
    chatHistory: [],
  }
}
