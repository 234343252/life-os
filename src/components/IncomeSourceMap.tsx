import { useState } from 'react'

export interface IncomeStage {
  key: string
  label: string
  description: string
  icon: string
  achieved: boolean
  current?: boolean
}

export interface IncomeSourceMapProps {
  stages: IncomeStage[]
  onStageClick?: (stage: IncomeStage) => void
  className?: string
}

export default function IncomeSourceMap({ stages, onStageClick, className = '' }: IncomeSourceMapProps) {
  const [expandedStage, setExpandedStage] = useState<string | null>(null)

  const toggleExpand = (key: string) => {
    setExpandedStage(prev => prev === key ? null : key)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col items-center py-2">
        {stages.map((stage, index) => {
          const isLast = index === stages.length - 1
          const isExpanded = expandedStage === stage.key
          const isAchieved = stage.achieved
          const isCurrent = stage.current

          return (
            <div key={stage.key} className="relative flex flex-col items-center w-full">
              {/* 连接线（上方） */}
              {!isLast && (
                <div className="w-0.5 h-6 relative z-0">
                  <div
                    className={`w-full h-full transition-colors duration-300 ${
                      isAchieved ? 'bg-green-400' : 'bg-neutral-200'
                    }`}
                  />
                </div>
              )}

              {/* 阶段节点 */}
              <button
                onClick={() => {
                  toggleExpand(stage.key)
                  onStageClick?.(stage)
                }}
                className={`
                  relative z-10 w-full flex items-center gap-3 p-3 rounded-xl
                  transition-all duration-300 text-left
                  ${isAchieved
                    ? 'bg-green-50 border border-green-200 hover:bg-green-100/80'
                    : 'bg-white border border-neutral-200 hover:bg-neutral-50'
                  }
                  ${isCurrent ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-white' : ''}
                `}
              >
                {/* 图标 */}
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg
                    transition-all duration-300
                    ${isAchieved
                      ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md shadow-green-200'
                      : 'bg-neutral-100 text-neutral-400 border-2 border-dashed border-neutral-300'
                    }
                  `}
                >
                  {isAchieved ? (
                    <span>{stage.icon}</span>
                  ) : (
                    <span className="opacity-60">{stage.icon}</span>
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        isAchieved ? 'text-green-800' : 'text-neutral-500'
                      }`}
                    >
                      {stage.label}
                    </span>
                    {isCurrent && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500 text-white font-medium">
                        当前
                      </span>
                    )}
                    {isAchieved && !isCurrent && (
                      <span className="text-xs text-green-600">✓</span>
                    )}
                  </div>

                  {/* 展开的描述 */}
                  <div
                    className={`
                      overflow-hidden transition-all duration-300
                      ${isExpanded ? 'max-h-20 mt-1.5' : 'max-h-0'}
                    `}
                  >
                    <p className={`text-xs leading-relaxed ${
                      isAchieved ? 'text-green-700' : 'text-neutral-500'
                    }`}>
                      {stage.description}
                    </p>
                  </div>
                </div>

                {/* 展开箭头 */}
                <svg
                  className={`
                    flex-shrink-0 w-4 h-4 transition-transform duration-300
                    ${isAchieved ? 'text-green-500' : 'text-neutral-400'}
                    ${isExpanded ? 'rotate-180' : ''}
                  `}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>

      {/* 底部起点标记 */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <div className="w-8 h-px bg-neutral-300" />
          <span>收入进化路径</span>
          <div className="w-8 h-px bg-neutral-300" />
        </div>
      </div>
    </div>
  )
}
