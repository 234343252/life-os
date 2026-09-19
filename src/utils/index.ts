export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return `${formatDate(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`
  return `${Math.floor(diffDays / 365)}年前`
}

export function getAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export function getCurrentAge(birthDate?: string): number {
  if (!birthDate) return 22 // 默认年龄
  return getAge(birthDate)
}

export function getLifeStage(age: number): string {
  if (age < 18) return '成长探索期'
  if (age < 25) return '能力资本积累期'
  if (age < 30) return '职业上升期'
  if (age < 35) return '事业建立期'
  if (age < 45) return '财富加速期'
  if (age < 55) return '自由探索期'
  return '人生收获期'
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str
  return str.slice(0, maxLen) + '...'
}

export function calculateWealthFreedom(savings: number, monthlyExpense: number): number {
  if (monthlyExpense <= 0) return Infinity
  return savings / monthlyExpense
}

export function formatWealthFreedom(months: number): string {
  if (months === Infinity) return '∞'
  if (months < 1) return '不足1个月'
  if (months < 12) return `${Math.floor(months)}个月`
  const years = Math.floor(months / 12)
  const remainingMonths = Math.floor(months % 12)
  if (remainingMonths === 0) return `${years}年`
  return `${years}年${remainingMonths}个月`
}

export function getSkillLevelLabel(level: number): string {
  const labels = ['未接触', '了解', '可以执行', '独立完成', '稳定产生结果', '可以复制给别人', '可以建立系统', '可以创造商业价值']
  return labels[level] || '未知'
}

export function getDaysBetween(start: string, end: string): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function getStartOfWeek(date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return formatDate(d)
}

export function getEndOfWeek(date = new Date()): string {
  const d = new Date(getStartOfWeek(date))
  d.setDate(d.getDate() + 6)
  return formatDate(d)
}

export function getStartOfMonth(date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth(), 1)
  return formatDate(d)
}

export function getEndOfMonth(date = new Date()): string {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return formatDate(d)
}
