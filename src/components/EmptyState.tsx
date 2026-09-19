import { ReactNode } from 'react'

export type EmptyStateVariant = 'default' | 'search' | 'data' | 'error'

export interface EmptyStateProps {
  /** 主标题 */
  title: string
  /** 描述文本 */
  description?: string
  /** 变体类型，影响图标和色调 */
  variant?: EmptyStateVariant
  /** 自定义图标，不传则根据 variant 使用默认图标 */
  icon?: ReactNode
  /** 操作按钮区域 */
  action?: ReactNode
  /** 自定义类名 */
  className?: string
  /** 图标大小 */
  iconSize?: 'sm' | 'md' | 'lg'
}

const iconSizeMap = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
}

const variantStyles = {
  default: {
    bg: 'bg-neutral-100',
    iconColor: 'text-neutral-400',
  },
  search: {
    bg: 'bg-green-50',
    iconColor: 'text-green-500',
  },
  data: {
    bg: 'bg-neutral-100',
    iconColor: 'text-neutral-400',
  },
  error: {
    bg: 'bg-red-50',
    iconColor: 'text-red-400',
  },
}

const DefaultIcon = ({ variant, className }: { variant: EmptyStateVariant; className: string }) => {
  const icons: Record<EmptyStateVariant, JSX.Element> = {
    default: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    search: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    data: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 3v18h18" />
        <path d="M7 14v3" />
        <path d="M12 10v7" />
        <path d="M17 6v11" />
      </svg>
    ),
    error: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  }

  return icons[variant]
}

const EmptyState = ({
  title,
  description,
  variant = 'default',
  icon,
  action,
  className = '',
  iconSize = 'md',
}: EmptyStateProps) => {
  const style = variantStyles[variant]

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <div
        className={`
          ${style.bg} ${style.iconColor}
          rounded-2xl flex items-center justify-center
          ${iconSize === 'sm' ? 'p-3' : iconSize === 'md' ? 'p-4' : 'p-6'}
          mb-4
        `}
      >
        {icon || <DefaultIcon variant={variant} className={iconSizeMap[iconSize]} />}
      </div>

      <h3 className="text-base font-semibold text-neutral-800 text-center mb-1.5">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-neutral-500 text-center max-w-xs leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export default EmptyState
