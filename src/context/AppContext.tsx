import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import type { AppState, User, Vision, Value, Goal, Task, Project, Skill, SkillEvidence, Learning, Career, Income, Expense, Asset, Liability, Experiment, Decision, BodyMetric, Interest, Relationship, TimeLog, EnergyLog, DailyLog, Reflection, AIInsight, Notification, LifeVersion, SubjectiveLife, SelfAlignment, ChatMessage } from '../types'
import { loadState, saveState } from '../services/storage'
import { generateId, formatDate } from '../utils'
import { getDemoData } from '../data/demoData'

type Action =
  | { type: 'SET_STATE'; payload: Partial<AppState> }
  // User
  | { type: 'SET_USER'; payload: User }
  // Vision
  | { type: 'ADD_VISION'; payload: Vision }
  | { type: 'UPDATE_VISION'; payload: Vision }
  // Values
  | { type: 'SET_VALUES'; payload: Value }
  // Goals
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  // Tasks
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  // Projects
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  // Skills
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: Skill }
  | { type: 'DELETE_SKILL'; payload: string }
  // Skill Evidence
  | { type: 'ADD_SKILL_EVIDENCE'; payload: SkillEvidence }
  // Learnings
  | { type: 'ADD_LEARNING'; payload: Learning }
  | { type: 'UPDATE_LEARNING'; payload: Learning }
  // Careers
  | { type: 'ADD_CAREER'; payload: Career }
  | { type: 'UPDATE_CAREER'; payload: Career }
  // Wealth
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'ADD_ASSET'; payload: Asset }
  | { type: 'ADD_LIABILITY'; payload: Liability }
  // Experiments
  | { type: 'ADD_EXPERIMENT'; payload: Experiment }
  | { type: 'UPDATE_EXPERIMENT'; payload: Experiment }
  | { type: 'DELETE_EXPERIMENT'; payload: string }
  // Decisions
  | { type: 'ADD_DECISION'; payload: Decision }
  | { type: 'UPDATE_DECISION'; payload: Decision }
  // Body
  | { type: 'ADD_BODY_METRIC'; payload: BodyMetric }
  // Interests
  | { type: 'ADD_INTEREST'; payload: Interest }
  // Relationships
  | { type: 'ADD_RELATIONSHIP'; payload: Relationship }
  // Time/Energy
  | { type: 'ADD_TIME_LOG'; payload: TimeLog }
  | { type: 'ADD_ENERGY_LOG'; payload: EnergyLog }
  // Daily Log
  | { type: 'ADD_DAILY_LOG'; payload: DailyLog }
  // Reflections
  | { type: 'ADD_REFLECTION'; payload: Reflection }
  // AI Insights
  | { type: 'ADD_AI_INSIGHT'; payload: AIInsight }
  // Notifications
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  // Life Versions
  | { type: 'ADD_LIFE_VERSION'; payload: LifeVersion }
  // Subjective Life
  | { type: 'ADD_SUBJECTIVE_LIFE'; payload: SubjectiveLife }
  // Self Alignment
  | { type: 'ADD_SELF_ALIGNMENT'; payload: SelfAlignment }
  // Chat
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT_HISTORY'; payload?: undefined }
  // Reset
  | { type: 'RESET_STATE'; payload?: undefined }

const initialState: AppState = {
  user: null,
  visions: [],
  values: null,
  goals: [],
  tasks: [],
  projects: [],
  skills: [],
  skillEvidences: [],
  learnings: [],
  careers: [],
  incomes: [],
  expenses: [],
  assets: [],
  liabilities: [],
  experiments: [],
  decisions: [],
  bodyMetrics: [],
  interests: [],
  relationships: [],
  timeLogs: [],
  energyLogs: [],
  dailyLogs: [],
  reflections: [],
  aiInsights: [],
  notifications: [],
  lifeVersions: [],
  subjectiveLife: [],
  selfAlignments: [],
  chatHistory: [],
}

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'ADD_VISION':
      return { ...state, visions: [...state.visions, action.payload] }
    case 'UPDATE_VISION':
      return {
        ...state,
        visions: state.visions.map(v => v.id === action.payload.id ? action.payload : v),
      }
    case 'SET_VALUES':
      return { ...state, values: action.payload }
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] }
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g),
      }
    case 'DELETE_GOAL':
      return { ...state, goals: state.goals.filter(g => g.id !== action.payload) }
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => t.id === action.payload.id ? action.payload : t),
      }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) }
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload
            ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
            : t
        ),
      }
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p),
      }
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p.id !== action.payload) }
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] }
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(s => s.id === action.payload.id ? action.payload : s),
      }
    case 'DELETE_SKILL':
      return { ...state, skills: state.skills.filter(s => s.id !== action.payload) }
    case 'ADD_SKILL_EVIDENCE':
      return { ...state, skillEvidences: [...state.skillEvidences, action.payload] }
    case 'ADD_LEARNING':
      return { ...state, learnings: [...state.learnings, action.payload] }
    case 'UPDATE_LEARNING':
      return {
        ...state,
        learnings: state.learnings.map(l => l.id === action.payload.id ? action.payload : l),
      }
    case 'ADD_CAREER':
      return { ...state, careers: [...state.careers, action.payload] }
    case 'UPDATE_CAREER':
      return {
        ...state,
        careers: state.careers.map(c => c.id === action.payload.id ? action.payload : c),
      }
    case 'ADD_INCOME':
      return { ...state, incomes: [...state.incomes, action.payload] }
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] }
    case 'ADD_ASSET':
      return { ...state, assets: [...state.assets, action.payload] }
    case 'ADD_LIABILITY':
      return { ...state, liabilities: [...state.liabilities, action.payload] }
    case 'ADD_EXPERIMENT':
      return { ...state, experiments: [...state.experiments, action.payload] }
    case 'UPDATE_EXPERIMENT':
      return {
        ...state,
        experiments: state.experiments.map(e => e.id === action.payload.id ? action.payload : e),
      }
    case 'DELETE_EXPERIMENT':
      return { ...state, experiments: state.experiments.filter(e => e.id !== action.payload) }
    case 'ADD_DECISION':
      return { ...state, decisions: [...state.decisions, action.payload] }
    case 'UPDATE_DECISION':
      return {
        ...state,
        decisions: state.decisions.map(d => d.id === action.payload.id ? action.payload : d),
      }
    case 'ADD_BODY_METRIC':
      return { ...state, bodyMetrics: [...state.bodyMetrics, action.payload] }
    case 'ADD_INTEREST':
      return { ...state, interests: [...state.interests, action.payload] }
    case 'ADD_RELATIONSHIP':
      return { ...state, relationships: [...state.relationships, action.payload] }
    case 'ADD_TIME_LOG':
      return { ...state, timeLogs: [...state.timeLogs, action.payload] }
    case 'ADD_ENERGY_LOG':
      return { ...state, energyLogs: [...state.energyLogs, action.payload] }
    case 'ADD_DAILY_LOG':
      return { ...state, dailyLogs: [...state.dailyLogs, action.payload] }
    case 'ADD_REFLECTION':
      return { ...state, reflections: [...state.reflections, action.payload] }
    case 'ADD_AI_INSIGHT':
      return { ...state, aiInsights: [...state.aiInsights, action.payload] }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] }
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      }
    case 'ADD_LIFE_VERSION':
      return { ...state, lifeVersions: [...state.lifeVersions, action.payload] }
    case 'ADD_SUBJECTIVE_LIFE':
      return { ...state, subjectiveLife: [...state.subjectiveLife, action.payload] }
    case 'ADD_SELF_ALIGNMENT':
      return { ...state, selfAlignments: [...state.selfAlignments, action.payload] }
    case 'ADD_CHAT_MESSAGE':
      return { ...state, chatHistory: [...state.chatHistory, action.payload] }
    case 'CLEAR_CHAT_HISTORY':
      return { ...state, chatHistory: [] }
    case 'RESET_STATE':
      return initialState
    default:
      return state
  }
}

interface AppContextType {
  state: AppState
  dispatch: React.Dispatch<Action>
  // Helper functions
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  addGoal: (goal: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  addProject: (project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  addSkill: (skill: Omit<Skill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  addSkillEvidence: (evidence: Omit<SkillEvidence, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  addExperiment: (exp: Omit<Experiment, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  addIncome: (income: Omit<Income, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  addDailyLog: (log: Omit<DailyLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  loadDemoData: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadState()
    if (saved.user) {
      dispatch({ type: 'SET_STATE', payload: saved })
    } else {
      // First time - load demo data
      const demoData = getDemoData()
      dispatch({ type: 'SET_STATE', payload: demoData })
    }
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    if (state.user) {
      saveState(state)
    }
  }, [state])

  const helperFns: AppContextType = {
    state,
    dispatch,
    addTask: (task) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'ADD_TASK',
        payload: {
          ...task,
          id: generateId(),
          userId: state.user?.id || 'local',
          createdAt: now,
          updatedAt: now,
        } as Task,
      })
    },
    toggleTask: (id) => dispatch({ type: 'TOGGLE_TASK', payload: id }),
    deleteTask: (id) => dispatch({ type: 'DELETE_TASK', payload: id }),
    addGoal: (goal) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'ADD_GOAL',
        payload: {
          ...goal,
          id: generateId(),
          userId: state.user?.id || 'local',
          createdAt: now,
          updatedAt: now,
        } as Goal,
      })
    },
    addProject: (project) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'ADD_PROJECT',
        payload: {
          ...project,
          id: generateId(),
          userId: state.user?.id || 'local',
          createdAt: now,
          updatedAt: now,
        } as Project,
      })
    },
    addSkill: (skill) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'ADD_SKILL',
        payload: {
          ...skill,
          id: generateId(),
          userId: state.user?.id || 'local',
          createdAt: now,
          updatedAt: now,
        } as Skill,
      })
    },
    addSkillEvidence: (evidence) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'ADD_SKILL_EVIDENCE',
        payload: {
          ...evidence,
          id: generateId(),
          userId: state.user?.id || 'local',
          createdAt: now,
          updatedAt: now,
        } as SkillEvidence,
      })
    },
    addExperiment: (exp) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'ADD_EXPERIMENT',
        payload: {
          ...exp,
          id: generateId(),
          userId: state.user?.id || 'local',
          createdAt: now,
          updatedAt: now,
        } as Experiment,
      })
    },
    addIncome: (income) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'ADD_INCOME',
        payload: {
          ...income,
          id: generateId(),
          userId: state.user?.id || 'local',
          createdAt: now,
          updatedAt: now,
        } as Income,
      })
    },
    addExpense: (expense) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'ADD_EXPENSE',
        payload: {
          ...expense,
          id: generateId(),
          userId: state.user?.id || 'local',
          createdAt: now,
          updatedAt: now,
        } as Expense,
      })
    },
    addDailyLog: (log) => {
      const now = new Date().toISOString()
      dispatch({
        type: 'ADD_DAILY_LOG',
        payload: {
          ...log,
          id: generateId(),
          userId: state.user?.id || 'local',
          createdAt: now,
          updatedAt: now,
        } as DailyLog,
      })
    },
    addChatMessage: (msg) => {
      dispatch({
        type: 'ADD_CHAT_MESSAGE',
        payload: {
          ...msg,
          id: generateId(),
          timestamp: new Date().toISOString(),
        } as ChatMessage,
      })
    },
    loadDemoData: () => {
      const demoData = getDemoData()
      dispatch({ type: 'SET_STATE', payload: demoData })
    },
  }

  return <AppContext.Provider value={helperFns}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
