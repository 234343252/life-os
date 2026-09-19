import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { useApp } from '../context/AppContext'
import { aiService } from '../services/ai'

type AIProviderType = 'openai' | 'deepseek'

interface AIConfig {
  provider: AIProviderType
  hasOpenAIKey: boolean
  hasDeepSeekKey: boolean
  demoMode?: boolean
  openai: {
    baseUrl: string
    model: string
  }
  deepseek: {
    baseUrl: string
    model: string
  }
}

// 检测是否运行在 Vercel 上
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')

export default function SettingsPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  // AI 配置状态
  const [config, setConfig] = useState<AIConfig | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<AIProviderType>('deepseek')
  const [openaiKey, setOpenaiKey] = useState('')
  const [deepseekKey, setDeepseekKey] = useState('')
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState('https://api.openai.com/v1')
  const [deepseekBaseUrl, setDeepseekBaseUrl] = useState('https://api.deepseek.com/v1')
  const [openaiModel, setOpenaiModel] = useState('gpt-4o-mini')
  const [deepseekModel, setDeepseekModel] = useState('deepseek-chat')
  const [showOpenAIKey, setShowOpenAIKey] = useState(false)
  const [showDeepSeekKey, setShowDeepSeekKey] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [loading, setLoading] = useState(true)

  // 重置数据弹窗
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetting, setResetting] = useState(false)

  // 加载配置
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/ai/config')
      const data = await response.json()
      if (data.success) {
        setConfig(data)
        setSelectedProvider(data.provider)
        setOpenaiBaseUrl(data.openai.baseUrl)
        setDeepseekBaseUrl(data.deepseek.baseUrl)
        setOpenaiModel(data.openai.model)
        setDeepseekModel(data.deepseek.model)
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveSuccess(false)
    setSaveError('')

    try {
      const body: any = {
        provider: selectedProvider,
      }

      if (openaiKey) {
        body.openai = { apiKey: openaiKey }
      }
      if (openaiBaseUrl) {
        body.openai = { ...body.openai, baseUrl: openaiBaseUrl, model: openaiModel }
      }
      if (deepseekKey) {
        body.deepseek = { apiKey: deepseekKey }
      }
      if (deepseekBaseUrl) {
        body.deepseek = { ...body.deepseek, baseUrl: deepseekBaseUrl, model: deepseekModel }
      }

      const response = await fetch('/api/ai/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      if (data.success) {
        setConfig(data)
        setSaveSuccess(true)
        if (data.hasOpenAIKey) setOpenaiKey('')
        if (data.hasDeepSeekKey) setDeepseekKey('')
        setTimeout(() => setSaveSuccess(false), 2000)
      } else {
        setSaveError(data.error || '保存失败')
      }
    } catch (error: any) {
      setSaveError(error.message || '保存失败')
    } finally {
      setSaving(false)
    }
  }

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

  const handleReset = () => {
    setResetting(true)
    setTimeout(() => {
      dispatch({ type: 'RESET_STATE' })
      setResetting(false)
      setShowResetModal(false)
    }, 800)
  }

  const currentProviderHasKey = selectedProvider === 'openai'
    ? config?.hasOpenAIKey
    : config?.hasDeepSeekKey

  return (
    <Layout
      title="设置"
      headerRight={
        <button
          onClick={() => navigate(-1)}
          className="text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      }
    >
      <div className="px-4 py-6 space-y-6">
        {/* AI 设置区域 */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider px-1">
            AI 设置
          </h2>

          {/* Vercel 部署提示 */}
          {isVercel && (
            <Card padding="lg" className="border-blue-200 bg-blue-50/50">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">云端部署模式</h3>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    检测到你正在使用 Vercel 部署版本。
                    <br />
                    API Key 通过 Vercel 环境变量安全配置，前端无法读取。
                  </p>
                  <div className="mt-3 bg-white/60 rounded-lg p-3 border border-blue-100">
                    <p className="text-xs text-blue-800 font-medium mb-2">配置方法：</p>
                    <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                      <li>进入 Vercel 项目后台</li>
                      <li>Settings → Environment Variables</li>
                      <li>添加 AI_PROVIDER = deepseek 或 openai</li>
                      <li>添加 DEEPSEEK_API_KEY 或 OPENAI_API_KEY</li>
                      <li>保存后重新部署即可生效</li>
                    </ol>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card padding="lg">
            {/* 连接状态 */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-neutral-700">连接状态</span>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${currentProviderHasKey ? 'bg-green-500' : 'bg-neutral-300'}`} />
                <span className={`text-sm ${currentProviderHasKey ? 'text-green-600' : 'text-neutral-500'}`}>
                  {currentProviderHasKey ? '已连接' : '未连接'}
                </span>
                {config?.demoMode && !currentProviderHasKey && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    Demo 模式
                  </span>
                )}
              </div>
            </div>

            {/* Provider 选择 */}
            <div className="mb-5">
              <label className="text-sm font-medium text-neutral-700 mb-2 block">
                AI Provider
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => !isVercel && setSelectedProvider('openai')}
                  disabled={isVercel}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedProvider === 'openai'
                      ? 'border-green-500 bg-green-50/50'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  } ${isVercel ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedProvider === 'openai' ? '#2d6e52' : '#78716c'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                    <span className={`text-sm font-semibold ${selectedProvider === 'openai' ? 'text-green-700' : 'text-neutral-700'}`}>
                      OpenAI
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">GPT 系列模型</p>
                  {selectedProvider === 'openai' && (
                    <div className="absolute top-2 right-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3d8966" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => !isVercel && setSelectedProvider('deepseek')}
                  disabled={isVercel}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedProvider === 'deepseek'
                      ? 'border-green-500 bg-green-50/50'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  } ${isVercel ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedProvider === 'deepseek' ? '#2d6e52' : '#78716c'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                    <span className={`text-sm font-semibold ${selectedProvider === 'deepseek' ? 'text-green-700' : 'text-neutral-700'}`}>
                      DeepSeek
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">深度求索模型</p>
                  {selectedProvider === 'deepseek' && (
                    <div className="absolute top-2 right-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3d8966" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
              {isVercel && (
                <p className="text-xs text-neutral-400 mt-2">
                  云端部署模式下，Provider 由环境变量 AI_PROVIDER 决定
                </p>
              )}
            </div>

            {/* 本地模式才显示配置表单 */}
            {!isVercel && (
              <>
                {/* OpenAI 配置 */}
                {selectedProvider === 'openai' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                        API Key
                        {config?.hasOpenAIKey && (
                          <span className="ml-2 text-xs text-green-600 font-normal">已配置</span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type={showOpenAIKey ? 'text' : 'password'}
                          value={openaiKey}
                          onChange={(e) => setOpenaiKey(e.target.value)}
                          placeholder={config?.hasOpenAIKey ? '••••••••（留空则不修改）' : 'sk-...'}
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                          {showOpenAIKey ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                        基础 URL <span className="text-neutral-400 font-normal">（可选）</span>
                      </label>
                      <input
                        type="text"
                        value={openaiBaseUrl}
                        onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                        placeholder="https://api.openai.com/v1"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                        模型名称 <span className="text-neutral-400 font-normal">（可选）</span>
                      </label>
                      <input
                        type="text"
                        value={openaiModel}
                        onChange={(e) => setOpenaiModel(e.target.value)}
                        placeholder="gpt-4o-mini"
                        className="input"
                      />
                    </div>
                  </div>
                )}

                {/* DeepSeek 配置 */}
                {selectedProvider === 'deepseek' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                        API Key
                        {config?.hasDeepSeekKey && (
                          <span className="ml-2 text-xs text-green-600 font-normal">已配置</span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type={showDeepSeekKey ? 'text' : 'password'}
                          value={deepseekKey}
                          onChange={(e) => setDeepseekKey(e.target.value)}
                          placeholder={config?.hasDeepSeekKey ? '••••••••（留空则不修改）' : 'sk-...'}
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeepSeekKey(!showDeepSeekKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                        >
                          {showDeepSeekKey ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                              <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                        基础 URL <span className="text-neutral-400 font-normal">（可选）</span>
                      </label>
                      <input
                        type="text"
                        value={deepseekBaseUrl}
                        onChange={(e) => setDeepseekBaseUrl(e.target.value)}
                        placeholder="https://api.deepseek.com/v1"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-neutral-700 mb-1.5 block">
                        模型名称 <span className="text-neutral-400 font-normal">（可选）</span>
                      </label>
                      <input
                        type="text"
                        value={deepseekModel}
                        onChange={(e) => setDeepseekModel(e.target.value)}
                        placeholder="deepseek-chat"
                        className="input"
                      />
                    </div>
                  </div>
                )}

                {/* 保存按钮 */}
                <div className="mt-5">
                  <Button
                    variant="primary"
                    block
                    loading={saving}
                    onClick={handleSave}
                    leftIcon={saveSuccess ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : undefined}
                  >
                    {saveSuccess ? '已保存' : '保存配置'}
                  </Button>
                  {saveError && (
                    <p className="text-xs text-red-500 mt-2 whitespace-pre-line">{saveError}</p>
                  )}
                </div>
              </>
            )}

            {/* Vercel 模式显示环境变量列表 */}
            {isVercel && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-neutral-600">当前环境变量：</p>
                <div className="bg-neutral-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500 font-mono">AI_PROVIDER</span>
                    <span className="text-xs text-neutral-700 font-medium">{config?.provider || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500 font-mono">DEEPSEEK_API_KEY</span>
                    <span className={`text-xs ${config?.hasDeepSeekKey ? 'text-green-600' : 'text-amber-600'}`}>
                      {config?.hasDeepSeekKey ? '✓ 已配置' : '✗ 未配置'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500 font-mono">OPENAI_API_KEY</span>
                    <span className={`text-xs ${config?.hasOpenAIKey ? 'text-green-600' : 'text-amber-600'}`}>
                      {config?.hasOpenAIKey ? '✓ 已配置' : '✗ 未配置'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* 数据管理 */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider px-1">
            数据管理
          </h2>

          <Card padding="none">
            <button
              onClick={handleExport}
              className="w-full p-4 flex items-center gap-3 text-left transition-all duration-200 hover:bg-neutral-50 border-b border-neutral-100 first:rounded-t-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-neutral-900">导出数据</div>
                <div className="text-xs text-neutral-500 mt-0.5">下载全部人生数据为 JSON 文件</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 flex-shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <button
              onClick={() => setShowResetModal(true)}
              className="w-full p-4 flex items-center gap-3 text-left transition-all duration-200 hover:bg-red-50 last:rounded-b-xl"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-red-600">重置数据</div>
                <div className="text-xs text-red-400 mt-0.5">清除所有本地数据，恢复初始状态</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 flex-shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </Card>
        </section>

        {/* 关于 */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider px-1">
            关于
          </h2>

          <Card padding="lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-soft">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Life OS</h3>
                <p className="text-sm text-neutral-500">v0.2.0</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <p className="text-sm text-neutral-600 leading-relaxed">
                看清自己，建立能力，创造价值。
                <br />
                一个帮助你系统化管理人生的工具。
              </p>
            </div>
          </Card>
        </section>

        <div className="h-8" />
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
