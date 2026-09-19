// ============ 基础类型 ============

export interface BaseModel {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}

// ============ 用户 ============

export interface User extends BaseModel {
  name: string
  avatar?: string
  birthDate?: string
  currentStage?: string
}

// ============ 人生愿景 ============

export interface Vision extends BaseModel {
  version: number
  year: number
  age: number
  wantToHave: string
  wantToBe: string
  wantToExperience: string
  wantToCreate: string
  wantToProvide: string
  absolutelyDontWant: string
  isActive: boolean
}

// ============ 价值观 ============

export interface Value extends BaseModel {
  mostImportant: string[]
  cannotAccept: string[]
  willingToWorkFor: string[]
  notWillingToExchange: string[]
}

// ============ 目标系统 ============

export type GoalType = 'result' | 'ability' | 'action'
export type GoalPeriod = '10year' | '5year' | '3year' | '1year' | 'quarter' | 'month' | 'week' | 'today'
export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled'

export interface Goal extends BaseModel {
  title: string
  description: string
  type: GoalType
  period: GoalPeriod
  deadline?: string
  progress: number // 0-100
  successCriteria: string
  whyImportant: string
  relatedSkills: string[]
  relatedWealth?: string
  relatedLifeDirection: string
  nextAction: string
  status: GoalStatus
  parentGoalId?: string
}

// ============ 任务 ============

export interface Task extends BaseModel {
  title: string
  description?: string
  goalId?: string
  goalTitle?: string
  relatedSkills: string[]
  longTermValue: string
  urgency: 'low' | 'medium' | 'high'
  priority: number
  completed: boolean
  completedAt?: string
  dueDate?: string
}

// ============ 项目 ============

export type ProjectStatus = 'planning' | 'active' | 'completed' | 'cancelled'

export interface Project extends BaseModel {
  name: string
  goal: string
  startDate?: string
  endDate?: string
  actions: string[]
  resources: string
  result?: string
  income?: number
  skillsGained: string[]
  works?: string[]
  connections?: string[]
  failureReason?: string
  experience?: string
  status: ProjectStatus
}

// ============ 能力系统 ============

export type SkillLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface Skill extends BaseModel {
  name: string
  category: string
  level: SkillLevel
  description?: string
  parentId?: string
  children?: Skill[]
}

export interface SkillEvidence extends BaseModel {
  skillId: string
  skillName: string
  whatHappened: string
  whatIDid: string
  result: string
  skillProven: string
  skillToImprove: string
  transferable: boolean
  transferableIndustries?: string
  projectId?: string
}

// ============ 学习系统 ============

export interface Learning extends BaseModel {
  title: string
  purpose: string
  targetSkillId?: string
  targetSkillName?: string
  projectId?: string
  projectName?: string
  duration: number // minutes
  completed: boolean
  applied: boolean
  applicationResult?: string
}

// ============ 职业 ============

export interface Career extends BaseModel {
  company: string
  position: string
  industry: string
  income: number
  workHours: number
  workContent: string
  skillsGained: string[]
  resourcesGained: string
  connectionsGained: string
  industryKnowledge: string
  clientsGained: string
  portableAssets: string
  companyAssets: string
  limitations: string
  risks: string
  isCurrent: boolean
  startDate: string
  endDate?: string
}

export interface CareerAsset {
  fromCompany: {
    salary: boolean
    platform: boolean
    clients: boolean
    resources: boolean
    training: boolean
  }
  portable: {
    skills: string[]
    methods: string[]
    cases: string[]
    industryKnowledge: string[]
    connections: string[]
    personalBrand: string[]
    clientRelationships: string[]
  }
}

// ============ 财富 ============

export interface Income extends BaseModel {
  amount: number
  source: 'salary' | 'bonus' | 'commission' | 'sideJob' | 'business' | 'investment' | 'other'
  description: string
  date: string
}

export interface Expense extends BaseModel {
  amount: number
  category: string
  description: string
  date: string
  isFixed: boolean
}

export interface Asset extends BaseModel {
  name: string
  type: string
  value: number
  description?: string
}

export interface Liability extends BaseModel {
  name: string
  type: string
  amount: number
  description?: string
}

export interface WealthSnapshot {
  date: string
  monthlyIncome: number
  monthlyExpense: number
  savings: number
  investments: number
  assets: number
  liabilities: number
  netWorth: number
}

// ============ 人生实验 ============

export type ExperimentType = 'career' | 'business' | 'sideJob' | 'interest' | 'life' | 'body' | 'relationship'
export type ExperimentConclusion = 'support' | 'partial_support' | 'not_support' | 'insufficient_evidence'
export type ExperimentStatus = 'ongoing' | 'completed'

export interface Experiment extends BaseModel {
  title: string
  type: ExperimentType
  hypothesis: string
  whyBelieve: string
  period: string
  actions: string
  cost: string
  successCriteria: string
  data: string
  finalEvidence?: string
  conclusion?: ExperimentConclusion
  status: ExperimentStatus
  startDate: string
  endDate?: string
}

// ============ 决策记录 ============

export interface Decision extends BaseModel {
  title: string
  category: string
  thoughtsAtTheTime: string
  informationAtTheTime: string
  prediction: string
  riskAssessment: string
  finalDecision: string
  actualResult?: string
  decisionDate: string
  reviewDate?: string
}

export interface DecisionReview extends BaseModel {
  decisionId: string
  predictionVsResult: string
  whatWasRight: string
  whatWasWrong: string
  lessonsLearned: string
}

// ============ 身体 ============

export interface BodyMetric extends BaseModel {
  date: string
  height?: number
  weight?: number
  sleepHours?: number
  exerciseMinutes?: number
  energyLevel?: number // 1-10
  mood?: string
  notes?: string
}

// ============ 兴趣 ============

export type InterestCategory = 'pure_enjoyment' | 'growth' | 'creative' | 'business_experiment'

export interface Interest extends BaseModel {
  name: string
  category: InterestCategory
  joyLevel: number // 1-10
  growthLevel: number // 1-10
  creativePotential: number // 1-10
  businessPotential: number // 1-10
  timeInvested: number // hours
  emotionalValue: number // 1-10
}

// ============ 关系 ============

export type RelationshipType = 'family' | 'friend' | 'colleague' | 'partner' | 'mentor'

export interface Relationship extends BaseModel {
  name: string
  type: RelationshipType
  contactFrequency: string
  depthLevel: number // 1-10
  sharedValues: string
  mutualSupport: string
  importantEvents: string
  changes: string
}

// ============ 时间/精力/注意力 ============

export type TimeCategory = 'work' | 'study' | 'entertainment' | 'body' | 'relationship' | 'other'

export interface TimeLog extends BaseModel {
  date: string
  category: TimeCategory
  duration: number // minutes
  description?: string
}

export interface EnergyLog extends BaseModel {
  date: string
  whatChargesMe: string
  whatDrainsMe: string
  overallEnergy: number // 1-10
}

export interface DailyLog extends BaseModel {
  date: string
  whatHappened: string
  biggestGain: string
  biggestDrain: string
  whatMadeMeHappy: string
  whatToNotice: string
  whatICompleted: string
  mood?: string
  tags: string[]
}

// ============ 复盘 ============

export type ReflectionPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

export interface Reflection extends BaseModel {
  period: ReflectionPeriod
  startDate: string
  endDate: string
  title: string
  completed: string
  growth: string
  wealth: string
  skills: string
  career: string
  body: string
  interests: string
  relationships: string
  happiness: string
  problems: string
  wrongJudgments: string
  newDiscoveries: string
  nextPeriodFocus: string
}

// ============ AI 洞察 ============

export type InsightType = 'daily' | 'weekly' | 'monthly' | 'trend' | 'risk'

export interface AIInsight extends BaseModel {
  type: InsightType
  title: string
  content: string
  facts: string[]
  inferences: string[]
  risks: string[]
  unknowns: string[]
  dataSources: string[]
  generatedAt: string
}

// ============ 通知 ============

export type NotificationType = 'critical' | 'attention' | 'action' | 'reflection' | 'reminder'
export type NotificationPriority = 'light' | 'standard' | 'strong'

export interface Notification extends BaseModel {
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  read: boolean
  link?: string
}

// ============ 人生版本 ============

export interface LifeVersion extends BaseModel {
  version: string
  name: string
  goals: string
  values: string
  wealth: string
  work: string
  skills: string
  concerns: string
  predictions: string
  decisions: string
  snapshotDate: string
}

// ============ 主观人生 ============

export interface SubjectiveLife extends BaseModel {
  date: string
  happiness: number // 1-10
  freedom: number // 1-10
  satisfaction: number // 1-10
  security: number // 1-10
  interest: number // 1-10
  relationships: number // 1-10
  selfIdentity: number // 1-10
  energy: number // 1-10
  environment: number // 1-10
}

// ============ 自我一致性 ============

export interface SelfAlignment extends BaseModel {
  date: string
  score: number // 0-100
  behaviorAlignment: number
  valueAlignment: number
  goalAlignment: number
  timeAlignment: number
  note?: string
}

// ============ AI 对话 ============

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// ============ AI Provider 接口（前端统一调用） ============

export interface AIAnalysisResult {
  facts: string[]
  inferences: string[]
  risks: string[]
  unknowns: string[]
}

export interface AIProvider {
  chat(messages: ChatMessage[], context?: any): Promise<string>
  analyze(data: any, analysisType?: string): Promise<AIAnalysisResult>
  generateInsight(data: any, insightType?: string): Promise<string>
  summarize(content: string, summaryType?: string): Promise<string>
}

// ============ 人生状态 ============

export interface LifeStatus {
  wealth: { trend: 'up' | 'down' | 'stable'; value: number }
  career: { trend: 'up' | 'down' | 'stable'; value: number }
  skills: { trend: 'up' | 'down' | 'stable'; value: number }
  body: { trend: 'up' | 'down' | 'stable'; value: number }
  interests: { trend: 'up' | 'down' | 'stable'; value: number }
  selfAlignment: { trend: 'up' | 'down' | 'stable'; value: number }
}

// ============ App 状态 ============

export interface AppState {
  user: User | null
  visions: Vision[]
  values: Value | null
  goals: Goal[]
  tasks: Task[]
  projects: Project[]
  skills: Skill[]
  skillEvidences: SkillEvidence[]
  learnings: Learning[]
  careers: Career[]
  incomes: Income[]
  expenses: Expense[]
  assets: Asset[]
  liabilities: Liability[]
  experiments: Experiment[]
  decisions: Decision[]
  bodyMetrics: BodyMetric[]
  interests: Interest[]
  relationships: Relationship[]
  timeLogs: TimeLog[]
  energyLogs: EnergyLog[]
  dailyLogs: DailyLog[]
  reflections: Reflection[]
  aiInsights: AIInsight[]
  notifications: Notification[]
  lifeVersions: LifeVersion[]
  subjectiveLife: SubjectiveLife[]
  selfAlignments: SelfAlignment[]
  chatHistory: ChatMessage[]
}
