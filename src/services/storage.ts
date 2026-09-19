import type { AppState } from '../types'

const STORAGE_KEY = 'life-os-state-v1'

const defaultState: AppState = {
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

export function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...defaultState, ...parsed }
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e)
  }
  return defaultState
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state to localStorage:', e)
  }
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY)
}
