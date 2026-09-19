export type TrendDirection = 'up' | 'down' | 'stable'

export interface TrendBadgeProps {
  /** 趋势方向 */
  direction: TrendDirection
  /** 显示的数值或文本 */
  value?: string | number
  /** 单位文本，如 %、分 等 */
  unit?: string
  /** 尺寸大小 */
  size?: 'sm' | 'md'
  /** 是否显示图标 */
  showIcon?: boolean
  /** 自定义类名 */
  className?: string
}

const directionConfig = {
  up: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    ),
  },
  down: {
    bg: 'bg-red-50',
    text: 'text-red-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
  },
  stable: {
    bg: 'bg-neutral-100',
    text: 'text-neutral-500',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
}

const sizeConfig = {
  sm: {
    container: 'px-2 py-0.5 gap-0.5',
    icon: 'w-3 h-3',
    text: 'text-xs',
  },
  md: {
    container: 'px-2.5 py-1 gap-1',
    icon: 'w-3.5 h-3.5',
    text: 'text-sm',
  },
}

const TrendBadge = ({
  direction,
  value,
  unit,
  size = 'sm',
  showIcon = true,
  className = '',
}: TrendBadgeProps) => {
  const config = directionConfig[direction]
  const sizes = sizeConfig[size]

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.bg} ${config.text}
        ${sizes.container}
        ${className}
      `}
    >
      {showIcon && <span className={sizes.icon}>{config.icon}</span>}
      {value !== undefined && (
        <span className={sizes.text}>
          {value}
          {unit && <span className="opacity-80">{unit}</span>}
        </span>
      )}
    </span>
  )
}

export default TrendBadge
