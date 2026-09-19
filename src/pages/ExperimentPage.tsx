import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { Experiment, ExperimentType, ExperimentConclusion } from '../types'
import { formatDate, truncate } from '../utils'

const typeLabel: Record<ExperimentType, string> = {
  career: '职业',
  business: '创业',
  sideJob: '副业',
  interest: '兴趣',
  life: '生活',
  body: '身体',
  relationship: '关系',
}

const typeColor: Record<ExperimentType, string> = {
  career: 'bg-green-50 text-green-700',
  business: 'bg-emerald-50 text-emerald-700',
  sideJob: 'bg-teal-50 text-teal-700',
  interest: 'bg-amber-50 text-amber-700',
  life: 'bg-sky-50 text-sky-700',
  body: 'bg-rose-50 text-rose-700',
  relationship: 'bg-pink-50 text-pink-700',
}

const conclusionLabel: Record<ExperimentConclusion, string> = {
  support: '支持',
  partial_support: '部分支持',
  not_support: '不支持',
  insufficient_evidence: '证据不足',
}

const conclusionColor: Record<ExperimentConclusion, string> = {
  support: 'bg-green-100 text-green-800',
  partial_support: 'bg-amber-100 text-amber-800',
  not_support: 'bg-red-100 text-red-800',
  insufficient_evidence: 'bg-neutral-100 text-neutral-700',
}

export default function ExperimentPage() {
  const { state, addExperiment } = useApp()
  const [showCreate, setShowCreate] = useState(false)

  // 表单状态
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ExperimentType>('life')
  const [hypothesis, setHypothesis] = useState('')
  const [whyBelieve, setWhyBelieve] = useState('')
  const [period, setPeriod] = useState('')
  const [actions, setActions] = useState('')
  const [cost, setCost] = useState('')
  const [successCriteria, setSuccessCriteria] = useState('')

  const ongoingExperiments = state.experiments.filter(e => e.status === 'ongoing')
  const completedExperiments = state.experiments.filter(e => e.status === 'completed')

  const resetForm = () => {
    setTitle('')
    setType('life')
    setHypothesis('')
    setWhyBelieve('')
    setPeriod('')
    setActions('')
    setCost('')
    setSuccessCriteria('')
  }

  const handleCreate = () => {
    if (!title.trim() || !hypothesis.trim()) return

    addExperiment({
      title: title.trim(),
      type,
      hypothesis: hypothesis.trim(),
      whyBelieve: whyBelieve.trim(),
      period: period.trim(),
      actions: actions.trim(),
      cost: cost.trim(),
      successCriteria: successCriteria.trim(),
      data: '',
      status: 'ongoing',
      startDate: formatDate(new Date()),
    })

    resetForm()
    setShowCreate(false)
  }

  const experimentTypes: ExperimentType[] = ['career', 'business', 'sideJob', 'interest', 'life', 'body', 'relationship']

  return (
    <div className="min-h-full bg-neutral-50 pb-20">
      {/* 顶部标题栏 */}
      <div className="sticky top-0 z-10 bg-neutral-50/90 backdrop-blur-sm safe-top">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-neutral-900">人生实验室</h1>
              <p className="text-xs text-neutral-500 mt-0.5">用实验的方式探索人生可能性</p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 active:bg-green-800 transition-colors shadow-soft"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              创建实验
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* 进行中的实验 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-neutral-900">进行中</h2>
            <span className="text-xs text-neutral-400">{ongoingExperiments.length} 个实验</span>
          </div>

          {ongoingExperiments.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-neutral-200 p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-green-50 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                  <path d="M9 2v6" />
                  <path d="M15 2v6" />
                  <path d="M11 13a2 2 0 1 0 2 0c0-1-1-1.5-1-3 0-1 1-1 1-2a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1c0 1 1 1 1 2 0 1.5-1 2-1 3z" />
                  <path d="M7 15a5 5 0 0 0 10 0" />
                  <path d="M12 20v2" />
                </svg>
              </div>
              <p className="text-sm text-neutral-500 mb-2">还没有进行中的实验</p>
              <p className="text-xs text-neutral-400">点击右上角创建你的第一个人生实验</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ongoingExperiments.map(exp => (
                <div
                  key={exp.id}
                  className="bg-white rounded-xl border border-neutral-100 shadow-soft p-4 animate-fade-in"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-neutral-900 flex-1 pr-2">
                      {exp.title}
                    </h3>
                    <span className={`tag flex-shrink-0 ${typeColor[exp.type]}`}>
                      {typeLabel[exp.type]}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-neutral-400 mb-1">假设</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">
                      {truncate(exp.hypothesis, 80)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">实验周期</p>
                      <p className="text-xs font-medium text-neutral-700">{exp.period || '未设定'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-400 mb-1">开始日期</p>
                      <p className="text-xs font-medium text-neutral-700">{exp.startDate}</p>
                    </div>
                  </div>

                  {exp.successCriteria && (
                    <div className="bg-green-50/50 rounded-lg px-3 py-2 mb-3">
                      <p className="text-xs text-green-700 leading-relaxed">
                        <span className="font-medium">成功标准：</span>
                        {truncate(exp.successCriteria, 60)}
                      </p>
                    </div>
                  )}

                  {exp.data && (
                    <div className="border-t border-neutral-100 pt-3">
                      <p className="text-xs text-neutral-400 mb-1">当前数据</p>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {truncate(exp.data, 80)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 已完成的实验 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-neutral-900">已完成</h2>
            <span className="text-xs text-neutral-400">{completedExperiments.length} 个实验</span>
          </div>

          {completedExperiments.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-neutral-200 p-6 text-center">
              <p className="text-sm text-neutral-400">暂无已完成的实验</p>
            </div>
          ) : (
            <div className="space-y-3">
              {completedExperiments.map(exp => (
                <div
                  key={exp.id}
                  className="bg-white rounded-xl border border-neutral-100 shadow-soft p-4 animate-fade-in"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-semibold text-neutral-900 flex-1 pr-2">
                      {exp.title}
                    </h3>
                    <span className={`tag flex-shrink-0 ${exp.conclusion ? conclusionColor[exp.conclusion] : 'tag-neutral'}`}>
                      {exp.conclusion ? conclusionLabel[exp.conclusion] : '待评估'}
                    </span>
                  </div>

                  <div className="mb-2">
                    <p className="text-xs text-neutral-400 mb-1">假设</p>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {truncate(exp.hypothesis, 60)}
                    </p>
                  </div>

                  {exp.finalEvidence && (
                    <div className="bg-neutral-50 rounded-lg px-3 py-2">
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        <span className="font-medium text-neutral-700">最终证据：</span>
                        {truncate(exp.finalEvidence, 80)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 创建实验弹窗 */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => { setShowCreate(false); resetForm() }}
          />
          <div
            className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated w-full max-w-md mx-4 max-h-[85vh] flex flex-col animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 flex-shrink-0">
              <h3 className="text-base font-semibold text-neutral-900">创建实验</h3>
              <button
                onClick={() => { setShowCreate(false); resetForm() }}
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
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  实验标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="给你的实验起个名字"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">实验类型</label>
                <div className="flex flex-wrap gap-2">
                  {experimentTypes.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        type === t
                          ? 'bg-green-600 text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {typeLabel[t]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  假设 <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="textarea h-20"
                  placeholder="你想验证的假设是什么？"
                  value={hypothesis}
                  onChange={e => setHypothesis(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">为什么相信</label>
                <textarea
                  className="textarea h-20"
                  placeholder="你为什么认为这个假设可能成立？"
                  value={whyBelieve}
                  onChange={e => setWhyBelieve(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">实验周期</label>
                <input
                  type="text"
                  className="input"
                  placeholder="如：2周、1个月、30天"
                  value={period}
                  onChange={e => setPeriod(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">行动步骤</label>
                <textarea
                  className="textarea h-20"
                  placeholder="具体要做什么来验证假设？"
                  value={actions}
                  onChange={e => setActions(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">成本</label>
                <input
                  type="text"
                  className="input"
                  placeholder="时间、金钱、精力等成本"
                  value={cost}
                  onChange={e => setCost(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">成功标准</label>
                <textarea
                  className="textarea h-20"
                  placeholder="达到什么结果才算实验成功？"
                  value={successCriteria}
                  onChange={e => setSuccessCriteria(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-100">
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowCreate(false); resetForm() }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!title.trim() || !hypothesis.trim()}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed transition-colors"
                >
                  创建实验
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
