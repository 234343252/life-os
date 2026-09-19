import { ReactNode, MouseEvent } from 'react'

export interface CardProps {
  children: ReactNode
  /** 点击事件，传入后卡片变为可点击状态 */
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
  /** 自定义类名 */
  className?: string
  /** 是否有悬停效果，默认 onClick 存在时自动开启 */
  hoverable?: boolean
  /** 内边距大小 */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** 圆角大小 */
  rounded?: 'sm' | 'md' | 'lg' | 'xl'
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

const roundedMap = {
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
}

const Card = ({
  children,
  onClick,
  className = '',
  hoverable,
  padding = 'md',
  rounded = 'lg',
}: CardProps) => {
  const isHoverable = hoverable !== undefined ? hoverable : !!onClick

  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-neutral-100 shadow-soft
        ${roundedMap[rounded]}
        ${paddingMap[padding]}
        ${isHoverable ? 'card-hover cursor-pointer' : ''}
        ${onClick ? 'active:scale-[0.99]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

/**
 * 卡片头部
 */
export const CardHeader = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => <div className={`flex items-center justify-between mb-3 ${className}`}>{children}</div>

/**
 * 卡片标题
 */
export const CardTitle = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => <h3 className={`text-base font-semibold text-neutral-900 ${className}`}>{children}</h3>

/**
 * 卡片内容
 */
export const CardContent = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => <div className={className}>{children}</div>

/**
 * 卡片底部
 */
export const CardFooter = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => (
  <div className={`flex items-center justify-between mt-4 pt-3 border-t border-neutral-100 ${className}`}>
    {children}
  </div>
)

export default Card
