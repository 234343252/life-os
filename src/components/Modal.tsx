import { ReactNode, useEffect, useCallback } from 'react'

export interface ModalProps {
  /** 是否显示 */
  open: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 标题 */
  title?: string
  /** 内容 */
  children: ReactNode
  /** 底部操作区 */
  footer?: ReactNode
  /** 点击遮罩是否关闭，默认 true */
  closeOnMaskClick?: boolean
  /** 是否显示关闭按钮，默认 true */
  showClose?: boolean
  /** 自定义容器类名 */
  className?: string
  /** 弹窗宽度类名 */
  widthClass?: string
}

const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  closeOnMaskClick = true,
  showClose = true,
  className = '',
  widthClass = 'max-w-sm w-full mx-4',
}: ModalProps) => {
  const handleMaskClick = useCallback(() => {
    if (closeOnMaskClick) {
      onClose()
    }
  }, [closeOnMaskClick, onClose])

  // ESC 关闭
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={handleMaskClick}
      />

      {/* 弹窗内容 */}
      <div
        className={`
          relative bg-white rounded-t-2xl sm:rounded-2xl shadow-elevated
          ${widthClass}
          max-h-[85vh] flex flex-col
          animate-slide-up
          ${className}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 flex-shrink-0">
            {title ? (
              <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
            ) : (
              <div />
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="p-1.5 -mr-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="关闭"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {/* 底部 */}
        {footer && (
          <div className="flex-shrink-0 px-5 py-4 border-t border-neutral-100">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
