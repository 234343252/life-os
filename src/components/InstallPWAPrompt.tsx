import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function InstallPWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // 检查是否已安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // 检查本地存储是否已关闭提示
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // 延迟显示，给用户一点时间浏览内容
      setTimeout(() => {
        if (!isDismissed) {
          setIsVisible(true)
        }
      }, 3000)
    }

    // 监听 appinstalled 事件
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isDismissed])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // 触发安装提示
    await deferredPrompt.prompt()

    // 等待用户选择
    const choiceResult = await deferredPrompt.userChoice
    if (choiceResult.outcome === 'accepted') {
      setIsVisible(false)
    }

    // 清除 deferred prompt
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    // 记录用户关闭状态，7天内不再显示
    const dismissUntil = Date.now() + 7 * 24 * 60 * 60 * 1000
    localStorage.setItem('pwa-prompt-dismissed', String(dismissUntil))
  }

  // 检查是否过了关闭有效期
  useEffect(() => {
    const dismissedStr = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissedStr) {
      const dismissUntil = parseInt(dismissedStr, 10)
      if (Date.now() > dismissUntil) {
        localStorage.removeItem('pwa-prompt-dismissed')
        setIsDismissed(false)
      }
    }
  }, [])

  if (!isVisible || isInstalled || isDismissed) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 animate-slide-up">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-elevated border border-green-100 overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          {/* 图标 */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-soft">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>

          {/* 文字 */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-neutral-900">添加到主屏幕</h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              安装 Life OS，随时查看你的人生数据
            </p>
          </div>

          {/* 关闭按钮 */}
          <button
            onClick={handleDismiss}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="关闭"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 操作按钮 */}
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-xl transition-colors hover:bg-neutral-200"
          >
            稍后再说
          </button>
          <button
            onClick={handleInstall}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-green-600 rounded-xl transition-colors hover:bg-green-700 flex items-center justify-center gap-1.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            安装
          </button>
        </div>
      </div>
    </div>
  )
}
