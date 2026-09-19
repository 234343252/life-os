import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Task, Project, Learning, SkillEvidence, Reflection, ReflectionPeriod, ProjectStatus, Decision } from '../types'
import { generateId, formatDate, truncate } from '../utils'

type TabKey = 'task' | 'project' | 'learning' | 'evidence' | 'reflection' | 'decision'

const tabs: { key: TabKey; label: string }[] = [
  { key: 'task', label: '任务' },
  { key: 'project', label: '项目' },
  { key: 'learning', label: '学习' },
  { key: 'evidence', label: '能力证据' },
  { key: 'reflection', label: '复盘' },
  { key: 'decision', label: '决策' },
]

const statusLabel: Record<ProjectStatus, string> = {
  planning: '规划中',
  active: '进行中',
  completed: '已完成',
  cancelled: '已取消',
}

const statusColor: Record<ProjectStatus, string> = {
  planning: 'bg-neutral-100 text-neutral-600',
  active: 'bg-green-50 text-green-700',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-neutral-100 text-neutral-500',
}

const periodLabel: Record<ReflectionPeriod, string> = {
  weekly: '周复盘',
  monthly: '月复盘',
  quarterly: '季复盘',
  yearly: '年复盘',
}

export default function GrowthPage() {
  const { state, dispatch, addTask, toggleTask, deleteTask, addProject, addSkillEvidence } = useApp()
  const [activeTab, setActiveTab] = useState<TabKey>('task')
  const [showAdd, setShowAdd] = useState(false)

  // ---- 任务表单 ----
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskUrgency, setTaskUrgency] = useState<'low' | 'medium' | 'high'>('medium')

  // ---- 项目表单 ----
  const [projectName, setProjectName] = useState('')
  const [projectGoal, setProjectGoal] = useState('')
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>('active')
  const [projectSkills, setProjectSkills] = useState('')

  // ---- 学习表单 ----
  const [learningTitle, setLearningTitle] = useState('')
  const [learningPurpose, setLearningPurpose] = useState('')
  const [learningDuration, setLearningDuration] = useState('')
  const [learningApplied, setLearningApplied] = useState(false)

  // ---- 能力证据表单 ----
  const [evidenceSkill, setEvidenceSkill] = useState('')
  const [evidenceWhatHappened, setEvidenceWhatHappened] = useState('')
  const [evidenceResult, setEvidenceResult] = useState('')
  const [evidenceTransferable, setEvidenceTransferable] = useState(true)

  // ---- 复盘表单 ----
  const [reflectionPeriod, setReflectionPeriod] = useState<ReflectionPeriod>('weekly')
  const [reflectionTitle, setReflectionTitle] = useState('')
  const [reflectionCompleted, setReflectionCompleted] = useState('')
  const [reflectionGrowth, setReflectionGrowth] = useState('')
  const [reflectionStartDate, setReflectionStartDate] = useState(formatDate(new Date()))
  const [reflectionEndDate, setReflectionEndDate] = useState(formatDate(new Date()))

  // ---- 决策表单 ----
  const [decisionTitle, setDecisionTitle] = useState('')
  const [decisionCategory, setDecisionCategory] = useState<'职业' | '财富' | '关系' | '生活' | '其他'>('职业')
  const [decisionThoughts, setDecisionThoughts] = useState('')
  const [decisionInformation, setDecisionInformation] = useState('')
  const [decisionPrediction, setDecisionPrediction] = useState('')
  const [decisionRisk, setDecisionRisk] = useState('')
  const [decisionFinal, setDecisionFinal] = useState('')
  const [decisionDate, setDecisionDate] = useState(formatDate(new Date()))

  // ---- 记录结果弹窗 ----
  const [showResultModal, setShowResultModal] = useState(false)
  const [editingDecision, setEditingDecision] = useState<Decision | null>(null)
  const [actualResult, setActualResult] = useState('')

  const resetForms = () => {
    setTaskTitle('')
    setTaskDesc('')
    setTaskUrgency('medium')
    setProjectName('')
    setProjectGoal('')
    setProjectStatus('active')
    setProjectSkills('')
    setLearningTitle('')
    setLearningPurpose('')
    setLearningDuration('')
    setLearningApplied(false)
    setEvidenceSkill('')
    setEvidenceWhatHappened('')
    setEvidenceResult('')
    setEvidenceTransferable(true)
    setReflectionPeriod('weekly')
    setReflectionTitle('')
    setReflectionCompleted('')
    setReflectionGrowth('')
    setReflectionStartDate(formatDate(new Date()))
    setReflectionEndDate(formatDate(new Date()))
    setDecisionTitle('')
    setDecisionCategory('职业')
    setDecisionThoughts('')
    setDecisionInformation('')
    setDecisionPrediction('')
    setDecisionRisk('')
    setDecisionFinal('')
    setDecisionDate(formatDate(new Date()))
  }

  const handleAdd = () => {
    const now = new Date().toISOString()
    const userId = state.user?.id || 'local'

    switch (activeTab) {
      case 'task':
        if (!taskTitle.trim()) return
        addTask({
          title: taskTitle.trim(),
          description: taskDesc.trim() || undefined,
          relatedSkills: [],
          longTermValue: '',
          urgency: taskUrgency,
          priority: 0,
          completed: false,
        })
        break
      case 'project':
        if (!projectName.trim()) return
        addProject({
          name: projectName.trim(),
          goal: projectGoal.trim(),
          actions: [],
          resources: '',
          skillsGained: projectSkills ? projectSkills.split(/[,，]/).map(s => s.trim()).filter(Boolean) : [],
          status: projectStatus,
        })
        break
      case 'learning':
        if (!learningTitle.trim()) return
        dispatch({
          type: 'ADD_LEARNING',
          payload: {
            id: generateId(),
            userId,
            createdAt: now,
            updatedAt: now,
            title: learningTitle.trim(),
            purpose: learningPurpose.trim(),
            duration: Number(learningDuration) || 0,
            completed: true,
            applied: learningApplied,
          } as Learning,
        })
        break
      case 'evidence':
        if (!evidenceSkill.trim()) return
        addSkillEvidence({
          skillId: '',
          skillName: evidenceSkill.trim(),
          whatHappened: evidenceWhatHappened.trim(),
          whatIDid: '',
          result: evidenceResult.trim(),
          skillProven: evidenceSkill.trim(),
          skillToImprove: '',
          transferable: evidenceTransferable,
        })
        break
      case 'reflection':
        if (!reflectionTitle.trim()) return
        dispatch({
          type: 'ADD_REFLECTION',
          payload: {
            id: generateId(),
            userId,
            createdAt: now,
            updatedAt: now,
            period: reflectionPeriod,
            startDate: reflectionStartDate,
            endDate: reflectionEndDate,
            title: reflectionTitle.trim(),
            completed: reflectionCompleted.trim(),
            growth: reflectionGrowth.trim(),
            wealth: '',
            skills: '',
            career: '',
            body: '',
            interests: '',
            relationships: '',
            happiness: '',
            problems: '',
            wrongJudgments: '',
            newDiscoveries: '',
            nextPeriodFocus: '',
          } as Reflection,
        })
        break
      case 'decision':
        if (!decisionTitle.trim()) return
        dispatch({
          type: 'ADD_DECISION',
          payload: {
            id: generateId(),
            userId,
            createdAt: now,
            updatedAt: now,
            title: decisionTitle.trim(),
            category: decisionCategory,
            thoughtsAtTheTime: decisionThoughts.trim(),
            informationAtTheTime: decisionInformation.trim(),
            prediction: decisionPrediction.trim(),
            riskAssessment: decisionRisk.trim(),
            finalDecision: decisionFinal.trim(),
            decisionDate,
          } as Decision,
        })
        break
    }

    resetForms()
    setShowAdd(false)
  }

  const handleDeleteProject = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id })
  }

  // ---- 渲染内容 ----
  const renderTaskTab = () => {
    const todayTasks = state.tasks.filter(t => {
      const taskDate = new Date(t.createdAt).toDateString()
      return taskDate === new Date().toDateString() || !t.completed
    }).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return (
      <div className="space-y-3">
        {todayTasks.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm">
            暂无任务，点击右上角添加
          </div>
        ) : (
          todayTasks.map(task => (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-neutral-100 shadow-soft p-4 flex items-start gap-3 animate-fade-in"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-all ${
                  task.completed
                    ? 'bg-green-600 border-green-600'
                    : 'border-neutral-300 hover:border-green-500'
                }`}
              >
                {task.completed && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.completed ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className={`text-xs mt-1 ${task.completed ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {truncate(task.description, 80)}
                  </p>
                )}
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="flex-shrink-0 p-1.5 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="删除"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    )
  }

  const renderProjectTab = () => {
    return (
      <div className="space-y-3">
        {state.projects.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm">
            暂无项目，点击右上角添加
          </div>
        ) : (
          state.projects.map(project => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-neutral-100 shadow-soft p-4 animate-fade-in"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-neutral-900">{project.name}</h3>
                <span className={`tag ${statusColor[project.status]}`}>
                  {statusLabel[project.status]}
                </span>
              </div>
              {project.goal && (
                <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
                  {truncate(project.goal, 100)}
                </p>
              )}
              {project.skillsGained.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {project.skillsGained.map((skill, idx) => (
                    <span key={idx} className="tag tag-green">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  const renderLearningTab = () => {
    return (
      <div className="space-y-3">
        {state.learnings.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm">
            暂无学习记录，点击右上角添加
          </div>
        ) : (
          state.learnings.map(learning => (
            <div
              key={learning.id}
              className="bg-white rounded-xl border border-neutral-100 shadow-soft p-4 animate-fade-in"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-neutral-900">{learning.title}</h3>
                <span className={`tag ${learning.applied ? 'tag-green' : 'tag-neutral'}`}>
                  {learning.applied ? '已应用' : '未应用'}
                </span>
              </div>
              {learning.purpose && (
                <p className="text-xs text-neutral-500 mb-2 leading-relaxed">
                  目的：{truncate(learning.purpose, 80)}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-neutral-400">
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {learning.duration} 分钟
                </span>
                {learning.targetSkillName && (
                  <span className="text-green-600">#{learning.targetSkillName}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    )
  }

  const renderEvidenceTab = () => {
    return (
      <div className="space-y-3">
        {state.skillEvidences.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm">
            暂无能力证据，点击右上角添加
          </div>
        ) : (
          state.skillEvidences.map(evidence => (
            <div
              key={evidence.id}
              className="bg-white rounded-xl border border-neutral-100 shadow-soft p-4 animate-fade-in"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-neutral-900">
                  {evidence.skillName}
                </h3>
                {evidence.transferable && (
                  <span className="tag tag-green">可迁移</span>
                )}
              </div>
              {evidence.whatHappened && (
                <p className="text-xs text-neutral-500 mb-2 leading-relaxed">
                  {truncate(evidence.whatHappened, 100)}
                </p>
              )}
              {evidence.result && (
                <div className="bg-green-50/50 rounded-lg px-3 py-2">
                  <p className="text-xs text-green-800 leading-relaxed">
                    <span className="font-medium">结果：</span>
                    {truncate(evidence.result, 80)}
                  </p>
                </div>
              )}
              {evidence.skillProven && (
                <p className="text-xs text-neutral-400 mt-2">
                  证明能力：{evidence.skillProven}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    )
  }

  const renderReflectionTab = () => {
    return (
      <div className="space-y-3">
        {state.reflections.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm">
            暂无复盘记录，点击右上角添加
          </div>
        ) : (
          state.reflections.map(reflection => (
            <div
              key={reflection.id}
              className="bg-white rounded-xl border border-neutral-100 shadow-soft p-4 animate-fade-in"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="tag tag-green">{periodLabel[reflection.period]}</span>
                <span className="text-xs text-neutral-400">
                  {reflection.startDate} ~ {reflection.endDate}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                {reflection.title}
              </h3>
              {reflection.completed && (
                <p className="text-xs text-neutral-500 leading-relaxed mb-1">
                  <span className="text-neutral-400">完成：</span>
                  {truncate(reflection.completed, 60)}
                </p>
              )}
              {reflection.growth && (
                <p className="text-xs text-neutral-500 leading-relaxed">
                  <span className="text-neutral-400">成长：</span>
                  {truncate(reflection.growth, 60)}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    )
  }

  const renderDecisionTab = () => {
    const decisionCategories: Record<string, string> = {
      '职业': 'bg-blue-50 text-blue-600',
      '财富': 'bg-amber-50 text-amber-600',
      '关系': 'bg-pink-50 text-pink-600',
      '生活': 'bg-purple-50 text-purple-600',
      '其他': 'bg-neutral-100 text-neutral-600',
    }

    const openResultModal = (decision: Decision) => {
      setEditingDecision(decision)
      setActualResult(decision.actualResult || '')
      setShowResultModal(true)
    }

    const handleSaveResult = () => {
      if (!editingDecision) return
      dispatch({
        type: 'UPDATE_DECISION',
        payload: {
          ...editingDecision,
          actualResult: actualResult.trim(),
          reviewDate: formatDate(new Date()),
          updatedAt: new Date().toISOString(),
        } as Decision,
      })
      setShowResultModal(false)
      setEditingDecision(null)
      setActualResult('')
    }

    return (
      <div className="space-y-3">
        {state.decisions.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 text-sm">
            暂无决策记录，点击右上角添加
          </div>
        ) : (
          state.decisions
            .sort((a, b) => new Date(b.decisionDate).getTime() - new Date(a.decisionDate).getTime())
            .map(decision => (
              <div
                key={decision.id}
                className="bg-white rounded-xl border border-neutral-100 shadow-soft p-4 animate-fade-in"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-semibold text-neutral-900 flex-1">
                    {decision.title}
                  </h3>
                  <span className={`tag ml-2 flex-shrink-0 ${decisionCategories[decision.category] || decisionCategories['其他']}`}>
                    {decision.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-neutral-400">
                    决策日期：{decision.decisionDate}
                  </span>
                  <span className={`tag text-xs ${decision.actualResult ? 'tag-green' : 'bg-neutral-100 text-neutral-500'}`}>
                    {decision.actualResult ? '已复盘' : '待复盘'}
                  </span>
                </div>

                {/* 预测 vs 实际结果 */}
                <div className="space-y-2 mb-3">
                  {decision.prediction && (
                    <div className="bg-blue-50/50 rounded-lg px-3 py-2">
                      <p className="text-xs text-blue-700 leading-relaxed">
                        <span className="font-medium">当时的预测：</span>
                        {truncate(decision.prediction, 80)}
                      </p>
                    </div>
                  )}
                  {decision.actualResult && (
                    <div className="bg-green-50/50 rounded-lg px-3 py-2">
                      <p className="text-xs text-green-700 leading-relaxed">
                        <span className="font-medium">实际结果：</span>
                        {truncate(decision.actualResult, 80)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => openResultModal(decision)}
                    className="text-xs text-green-600 font-medium hover:text-green-700 transition-colors"
                  >
                    {decision.actualResult ? '更新结果' : '记录结果'}
                  </button>
                </div>
              </div>
            ))
        )}

        {/* 记录结果弹窗 */}
        {showResultModal && editingDecision && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
              onClick={() => { setShowResultModal(false); setEditingDecision(null); setActualResult('') }}
            />
            <div
              className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated w-full max-w-sm mx-4 max-h-[85vh] flex flex-col animate-slide-up"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 flex-shrink-0">
                <h3 className="text-base font-semibold text-neutral-900">记录实际结果</h3>
                <button
                  onClick={() => { setShowResultModal(false); setEditingDecision(null); setActualResult('') }}
                  className="p-1.5 -mr-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="关闭"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">决策标题</label>
                  <p className="text-sm text-neutral-600 bg-neutral-50 rounded-lg px-3 py-2">
                    {editingDecision.title}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">当时的预测</label>
                  <p className="text-sm text-neutral-600 bg-blue-50/50 rounded-lg px-3 py-2">
                    {editingDecision.prediction || '（未填写）'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">实际结果</label>
                  <textarea
                    className="textarea h-32"
                    placeholder="描述实际发生的结果..."
                    value={actualResult}
                    onChange={e => setActualResult(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-100">
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowResultModal(false); setEditingDecision(null); setActualResult('') }}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleSaveResult}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    保存结果
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'task': return renderTaskTab()
      case 'project': return renderProjectTab()
      case 'learning': return renderLearningTab()
      case 'evidence': return renderEvidenceTab()
      case 'reflection': return renderReflectionTab()
      case 'decision': return renderDecisionTab()
    }
  }

  // ---- 添加表单 ----
  const renderAddForm = () => {
    switch (activeTab) {
      case 'task':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">任务标题</label>
              <input
                type="text"
                className="input"
                placeholder="输入任务标题"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">描述（可选）</label>
              <textarea
                className="textarea h-24"
                placeholder="任务详情..."
                value={taskDesc}
                onChange={e => setTaskDesc(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">紧急程度</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setTaskUrgency(u)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      taskUrgency === u
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {u === 'low' ? '低' : u === 'medium' ? '中' : '高'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 'project':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">项目名称</label>
              <input
                type="text"
                className="input"
                placeholder="输入项目名称"
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">项目目标</label>
              <textarea
                className="textarea h-24"
                placeholder="描述项目要达成的目标..."
                value={projectGoal}
                onChange={e => setProjectGoal(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">状态</label>
              <div className="grid grid-cols-2 gap-2">
                {(['planning', 'active', 'completed', 'cancelled'] as ProjectStatus[]).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setProjectStatus(s)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      projectStatus === s
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">获得的能力（逗号分隔）</label>
              <input
                type="text"
                className="input"
                placeholder="如：项目管理, 沟通能力"
                value={projectSkills}
                onChange={e => setProjectSkills(e.target.value)}
              />
            </div>
          </div>
        )
      case 'learning':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">学习内容</label>
              <input
                type="text"
                className="input"
                placeholder="输入学习内容标题"
                value={learningTitle}
                onChange={e => setLearningTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">学习目的</label>
              <textarea
                className="textarea h-20"
                placeholder="为什么学这个..."
                value={learningPurpose}
                onChange={e => setLearningPurpose(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">学习时长（分钟）</label>
              <input
                type="number"
                className="input"
                placeholder="30"
                value={learningDuration}
                onChange={e => setLearningDuration(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700">是否已应用</span>
              <button
                type="button"
                onClick={() => setLearningApplied(!learningApplied)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  learningApplied ? 'bg-green-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    learningApplied ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )
      case 'evidence':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">能力名称</label>
              <input
                type="text"
                className="input"
                placeholder="证明了什么能力"
                value={evidenceSkill}
                onChange={e => setEvidenceSkill(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">发生了什么</label>
              <textarea
                className="textarea h-24"
                placeholder="描述事件经过..."
                value={evidenceWhatHappened}
                onChange={e => setEvidenceWhatHappened(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">结果如何</label>
              <textarea
                className="textarea h-20"
                placeholder="最终的结果..."
                value={evidenceResult}
                onChange={e => setEvidenceResult(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-700">是否可迁移</span>
              <button
                type="button"
                onClick={() => setEvidenceTransferable(!evidenceTransferable)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  evidenceTransferable ? 'bg-green-600' : 'bg-neutral-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    evidenceTransferable ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        )
      case 'reflection':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">复盘周期</label>
              <div className="grid grid-cols-4 gap-2">
                {(['weekly', 'monthly', 'quarterly', 'yearly'] as ReflectionPeriod[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setReflectionPeriod(p)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      reflectionPeriod === p
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {periodLabel[p]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">复盘标题</label>
              <input
                type="text"
                className="input"
                placeholder="如：第37周复盘"
                value={reflectionTitle}
                onChange={e => setReflectionTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">开始日期</label>
                <input
                  type="date"
                  className="input"
                  value={reflectionStartDate}
                  onChange={e => setReflectionStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">结束日期</label>
                <input
                  type="date"
                  className="input"
                  value={reflectionEndDate}
                  onChange={e => setReflectionEndDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">完成了什么</label>
              <textarea
                className="textarea h-20"
                placeholder="本期主要完成..."
                value={reflectionCompleted}
                onChange={e => setReflectionCompleted(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">成长与收获</label>
              <textarea
                className="textarea h-20"
                placeholder="学到了什么，成长了什么..."
                value={reflectionGrowth}
                onChange={e => setReflectionGrowth(e.target.value)}
              />
            </div>
          </div>
        )
      case 'decision':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">决策标题</label>
              <input
                type="text"
                className="input"
                placeholder="如：是否接受新工作机会"
                value={decisionTitle}
                onChange={e => setDecisionTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">分类</label>
              <div className="grid grid-cols-5 gap-2">
                {(['职业', '财富', '关系', '生活', '其他'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setDecisionCategory(cat)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      decisionCategory === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">决策日期</label>
              <input
                type="date"
                className="input"
                value={decisionDate}
                onChange={e => setDecisionDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">当时的想法</label>
              <textarea
                className="textarea h-20"
                placeholder="做决策时的内心想法..."
                value={decisionThoughts}
                onChange={e => setDecisionThoughts(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">当时的信息</label>
              <textarea
                className="textarea h-20"
                placeholder="做决策时掌握的信息..."
                value={decisionInformation}
                onChange={e => setDecisionInformation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">当时的预测</label>
              <textarea
                className="textarea h-20"
                placeholder="你预测会发生什么..."
                value={decisionPrediction}
                onChange={e => setDecisionPrediction(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">风险判断</label>
              <textarea
                className="textarea h-20"
                placeholder="你判断的风险是什么..."
                value={decisionRisk}
                onChange={e => setDecisionRisk(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">最终决定</label>
              <textarea
                className="textarea h-20"
                placeholder="最终做出了什么决定..."
                value={decisionFinal}
                onChange={e => setDecisionFinal(e.target.value)}
              />
            </div>
          </div>
        )
    }
  }

  const addBtnLabel = {
    task: '添加任务',
    project: '添加项目',
    learning: '添加学习',
    evidence: '添加证据',
    reflection: '添加复盘',
    decision: '添加决策',
  }[activeTab]

  return (
    <div className="min-h-full bg-neutral-50 pb-20">
      {/* 顶部标题栏 */}
      <div className="sticky top-0 z-10 bg-neutral-50/90 backdrop-blur-sm safe-top">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold text-neutral-900">成长</h1>
            <button
              onClick={() => setShowAdd(true)}
              className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 active:bg-green-800 transition-colors shadow-soft"
              aria-label="添加"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Tab 切换 */}
          <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 flex-1 min-w-[56px] py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-green-700 shadow-soft'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="px-4 py-4">
        {renderTabContent()}
      </div>

      {/* 添加弹窗 */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => { setShowAdd(false); resetForms() }}
          />
          <div
            className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated w-full max-w-sm mx-4 max-h-[85vh] flex flex-col animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 flex-shrink-0">
              <h3 className="text-base font-semibold text-neutral-900">{addBtnLabel}</h3>
              <button
                onClick={() => { setShowAdd(false); resetForms() }}
                className="p-1.5 -mr-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="关闭"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {renderAddForm()}
            </div>
            <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-100">
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowAdd(false); resetForms() }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  确认添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
