import { useState, useMemo } from 'react'
import type { Skill } from '../types'
import { getSkillLevelLabel } from '../utils'

export interface SkillTreeProps {
  skills: Skill[]
  onSkillClick?: (skill: Skill) => void
  className?: string
}

// 能力等级对应的视觉样式
function getSkillVisual(level: number) {
  if (level <= 1) {
    return {
      type: 'bud' as const,
      fill: '#bbf7d0',
      stroke: '#86efac',
      size: 6 + level * 2,
      glow: false,
    }
  }
  if (level <= 3) {
    return {
      type: 'leaf' as const,
      fill: level === 2 ? '#4ade80' : '#22c55e',
      stroke: '#16a34a',
      size: 10 + (level - 2) * 3,
      glow: false,
    }
  }
  if (level <= 5) {
    return {
      type: 'leaf' as const,
      fill: level === 4 ? '#16a34a' : '#15803d',
      stroke: '#166534',
      size: 14 + (level - 4) * 3,
      glow: true,
    }
  }
  // L6-L7: 金色果实
  return {
    type: 'fruit' as const,
    fill: level === 6 ? '#fbbf24' : '#f59e0b',
    stroke: '#d97706',
    size: 12 + (level - 6) * 4,
    glow: true,
  }
}

// 四大能力分类及其在树上的位置
const CATEGORIES = [
  { name: '商业能力', side: 'right', branchIndex: 0, angle: 35 },
  { name: '学习能力', side: 'left', branchIndex: 0, angle: -35 },
  { name: '创造能力', side: 'right', branchIndex: 1, angle: 55 },
  { name: '人际能力', side: 'left', branchIndex: 1, angle: -55 },
]

export default function SkillTree({ skills, onSkillClick, className = '' }: SkillTreeProps) {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // 按分类分组
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, Skill[]> = {}
    skills.forEach(s => {
      if (!groups[s.category]) {
        groups[s.category] = []
      }
      groups[s.category].push(s)
    })
    return groups
  }, [skills])

  // SVG 尺寸
  const width = 380
  const height = 420
  const trunkBaseX = width / 2
  const trunkBaseY = height - 40
  const trunkTopY = 140

  // 树枝起点（树干上的位置）
  const branchOrigins = [
    { y: trunkTopY + 30 },  // 第一对树枝（较高）
    { y: trunkTopY + 80 },  // 第二对树枝（较低）
  ]

  // 计算每个技能在树枝上的位置
  const skillPositions = useMemo(() => {
    const positions: { skill: Skill; x: number; y: number; rotation: number }[] = []

    CATEGORIES.forEach(cat => {
      const categorySkills = groupedByCategory[cat.name] || []
      if (categorySkills.length === 0) return

      const originY = branchOrigins[cat.branchIndex].y
      const side = cat.side === 'right' ? 1 : -1
      const angleRad = (cat.angle * Math.PI) / 180

      // 树枝长度
      const branchLength = 90 + cat.branchIndex * 15

      // 沿树枝分布技能
      const totalSkills = categorySkills.length
      categorySkills.forEach((skill, idx) => {
        // 从靠近树干到远离树干分布
        const t = totalSkills === 1 ? 0.6 : 0.35 + (idx / (totalSkills - 1)) * 0.55
        const distFromTrunk = branchLength * t

        // 基础位置（沿树枝）
        const baseX = trunkBaseX + side * Math.cos(angleRad) * distFromTrunk
        const baseY = originY - Math.sin(angleRad) * distFromTrunk

        // 添加一些垂直偏移，让叶子分散开
        const verticalOffset = (idx % 2 === 0 ? -1 : 1) * (8 + idx * 3)

        positions.push({
          skill,
          x: baseX + side * (idx % 2) * 8,
          y: baseY + verticalOffset,
          rotation: side * (cat.angle - 15 + idx * 8),
        })
      })
    })

    return positions
  }, [groupedByCategory])

  const handleMouseEnter = (skill: Skill, e: React.MouseEvent<SVGGElement>) => {
    setHoveredSkill(skill)
    const svg = e.currentTarget.closest('svg')
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!hoveredSkill) return
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => {
    setHoveredSkill(null)
  }

  // 绘制叶子形状
  const renderLeaf = (x: number, y: number, size: number, fill: string, stroke: string, rotation: number, glow: boolean) => {
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
        {glow && (
          <ellipse cx="0" cy="0" rx={size + 3} ry={size * 0.6 + 3} fill={fill} opacity="0.3" />
        )}
        <ellipse
          cx="0"
          cy="0"
          rx={size}
          ry={size * 0.6}
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
        />
        {/* 叶脉 */}
        <line x1={-size * 0.8} y1="0" x2={size * 0.8} y2="0" stroke={stroke} strokeWidth="0.5" opacity="0.5" />
        <line x1={-size * 0.3} y1={-size * 0.3} x2={-size * 0.1} y2="0" stroke={stroke} strokeWidth="0.5" opacity="0.4" />
        <line x1={size * 0.1} y1="0" x2={size * 0.3} y2={-size * 0.3} stroke={stroke} strokeWidth="0.5" opacity="0.4" />
      </g>
    )
  }

  // 绘制芽形状
  const renderBud = (x: number, y: number, size: number, fill: string, stroke: string, rotation: number) => {
    return (
      <g transform={`translate(${x}, ${y}) rotate(${rotation - 90})`}>
        <path
          d={`M 0 ${size} Q ${size * 0.8} ${size * 0.3} 0 ${-size * 0.5} Q ${-size * 0.8} ${size * 0.3} 0 ${size} Z`}
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
        />
      </g>
    )
  }

  // 绘制果实形状
  const renderFruit = (x: number, y: number, size: number, fill: string, stroke: string, glow: boolean) => {
    return (
      <g transform={`translate(${x}, ${y})`}>
        {glow && (
          <>
            <circle cx="0" cy="0" r={size + 5} fill={fill} opacity="0.2" />
            <circle cx="0" cy="0" r={size + 2} fill={fill} opacity="0.3" />
          </>
        )}
        <circle cx="0" cy="0" r={size} fill={fill} stroke={stroke} strokeWidth="1" />
        {/* 高光 */}
        <ellipse cx={-size * 0.3} cy={-size * 0.3} rx={size * 0.3} ry={size * 0.2} fill="white" opacity="0.4" />
        {/* 果柄 */}
        <line x1="0" y1={-size} x2="2" y2={-size - 4} stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
        {/* 小叶子 */}
        <ellipse cx="5" cy={-size - 3} rx="4" ry="2" fill="#22c55e" transform={`rotate(30, 5, ${-size - 3})`} />
      </g>
    )
  }

  if (skills.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <p className="text-sm text-neutral-400">还没有记录任何能力</p>
      </div>
    )
  }

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
      >
        <defs>
          {/* 树干渐变 */}
          <linearGradient id="trunkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="50%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* 地面 */}
          <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#dcfce7" />
            <stop offset="100%" stopColor="#bbf7d0" />
          </linearGradient>

          {/* 光晕效果 */}
          <radialGradient id="treeGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#bbf7d0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 背景光晕 */}
        <ellipse cx={trunkBaseX} cy={trunkTopY + 60} rx="160" ry="140" fill="url(#treeGlow)" />

        {/* 地面 */}
        <ellipse cx={trunkBaseX} cy={trunkBaseY + 15} rx="120" ry="12" fill="url(#groundGradient)" />
        <ellipse cx={trunkBaseX} cy={trunkBaseY + 10} rx="90" ry="8" fill="#86efac" opacity="0.5" />

        {/* 小草 */}
        {[-60, -40, -20, 0, 20, 40, 60].map((offset, i) => (
          <g key={i} transform={`translate(${trunkBaseX + offset}, ${trunkBaseY + 12})`}>
            <path
              d={`M 0 0 Q ${offset > 0 ? 2 : -2} -5 0 -8`}
              stroke="#4ade80"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* 树干 */}
        <path
          d={`
            M ${trunkBaseX - 14} ${trunkBaseY}
            Q ${trunkBaseX - 16} ${trunkBaseY - 80} ${trunkBaseX - 12} ${trunkBaseY - 140}
            Q ${trunkBaseX - 10} ${trunkTopY + 20} ${trunkBaseX - 8} ${trunkTopY}
            L ${trunkBaseX + 8} ${trunkTopY}
            Q ${trunkBaseX + 10} ${trunkTopY + 20} ${trunkBaseX + 12} ${trunkBaseY - 140}
            Q ${trunkBaseX + 16} ${trunkBaseY - 80} ${trunkBaseX + 14} ${trunkBaseY}
            Z
          `}
          fill="url(#trunkGradient)"
        />

        {/* 树干纹理 */}
        <path
          d={`M ${trunkBaseX - 5} ${trunkBaseY - 30} Q ${trunkBaseX - 3} ${trunkBaseY - 100} ${trunkBaseX - 4} ${trunkTopY + 30}`}
          stroke="#78350f"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        <path
          d={`M ${trunkBaseX + 4} ${trunkBaseY - 50} Q ${trunkBaseX + 6} ${trunkBaseY - 110} ${trunkBaseX + 3} ${trunkTopY + 50}`}
          stroke="#78350f"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />

        {/* "能力根基" 标签 */}
        <g transform={`translate(${trunkBaseX}, ${trunkBaseY + 28})`}>
          <rect x="-40" y="-10" width="80" height="20" rx="10" fill="white" stroke="#86efac" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" className="text-xs" fill="#166534" fontSize="11" fontWeight="500">
            能力根基
          </text>
        </g>

        {/* 主树枝 */}
        {CATEGORIES.map((cat, idx) => {
          const categorySkills = groupedByCategory[cat.name] || []
          if (categorySkills.length === 0) return null

          const originY = branchOrigins[cat.branchIndex].y
          const side = cat.side === 'right' ? 1 : -1
          const angleRad = (cat.angle * Math.PI) / 180
          const branchLength = 90 + cat.branchIndex * 15

          const endX = trunkBaseX + side * Math.cos(angleRad) * branchLength
          const endY = originY - Math.sin(angleRad) * branchLength

          // 树枝控制点（用于弯曲效果）
          const ctrlX = trunkBaseX + side * Math.cos(angleRad) * branchLength * 0.5
          const ctrlY = originY - Math.sin(angleRad) * branchLength * 0.5 - 10

          return (
            <g key={cat.name}>
              {/* 主树枝 */}
              <path
                d={`M ${trunkBaseX + side * 8} ${originY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                stroke="#78350f"
                strokeWidth={6 - cat.branchIndex * 1.5}
                fill="none"
                strokeLinecap="round"
              />
              {/* 树枝高光 */}
              <path
                d={`M ${trunkBaseX + side * 8} ${originY - 1} Q ${ctrlX} ${ctrlY - 1} ${endX} ${endY - 1}`}
                stroke="#92400e"
                strokeWidth={2 - cat.branchIndex * 0.5}
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />

              {/* 分类标签 */}
              <g transform={`translate(${endX + side * 5}, ${endY - 15})`}>
                <rect
                  x={side === 1 ? 0 : -60}
                  y="-10"
                  width="60"
                  height="20"
                  rx="10"
                  fill="#f0fdf4"
                  stroke="#86efac"
                  strokeWidth="1"
                />
                <text
                  x={side === 1 ? 30 : -30}
                  y="4"
                  textAnchor="middle"
                  fill="#166534"
                  fontSize="11"
                  fontWeight="500"
                >
                  {cat.name}
                </text>
              </g>

              {/* 小分枝 */}
              {categorySkills.length > 1 && categorySkills.slice(1).map((_, sIdx) => {
                const t = 0.4 + (sIdx / (categorySkills.length - 1)) * 0.5
                const twigX = trunkBaseX + side * Math.cos(angleRad) * branchLength * t
                const twigY = originY - Math.sin(angleRad) * branchLength * t - 8
                const twigLength = 15 + sIdx * 5
                const twigAngle = side * (cat.angle + 20 + sIdx * 10)
                const twigEndX = twigX + side * Math.cos((twigAngle * Math.PI) / 180) * twigLength
                const twigEndY = twigY - Math.sin((twigAngle * Math.PI) / 180) * twigLength

                return (
                  <path
                    key={sIdx}
                    d={`M ${twigX} ${twigY} Q ${(twigX + twigEndX) / 2} ${(twigY + twigEndY) / 2 - 3} ${twigEndX} ${twigEndY}`}
                    stroke="#78350f"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                )
              })}
            </g>
          )
        })}

        {/* 技能叶子/果实 */}
        {skillPositions.map(({ skill, x, y, rotation }) => {
          const visual = getSkillVisual(skill.level)
          const isHovered = hoveredSkill?.id === skill.id

          return (
            <g
              key={skill.id}
              style={{ cursor: onSkillClick ? 'pointer' : 'default' }}
              onClick={() => onSkillClick?.(skill)}
              onMouseEnter={(e) => handleMouseEnter(skill, e)}
              onMouseLeave={handleMouseLeave}
            >
              {/* 悬停放大效果 */}
              <g transform={isHovered ? `translate(${x}, ${y}) scale(1.2) translate(${-x}, ${-y})` : ''}>
                {visual.type === 'bud' && renderBud(x, y, visual.size, visual.fill, visual.stroke, rotation)}
                {visual.type === 'leaf' && renderLeaf(x, y, visual.size, visual.fill, visual.stroke, rotation, visual.glow)}
                {visual.type === 'fruit' && renderFruit(x, y, visual.size, visual.fill, visual.stroke, visual.glow)}
              </g>
            </g>
          )
        })}

        {/* 装饰：几只小鸟 */}
        <g transform={`translate(${trunkBaseX + 60}, ${trunkTopY - 20})`}>
          <ellipse cx="0" cy="0" rx="8" ry="5" fill="#4ade80" />
          <circle cx="5" cy="-2" r="3" fill="#4ade80" />
          <circle cx="6" cy="-3" r="0.8" fill="#166534" />
          <path d="M -5 0 Q -8 -3 -5 -5" stroke="#22c55e" strokeWidth="1.5" fill="none" />
        </g>
      </svg>

      {/* 悬浮提示 */}
      {hoveredSkill && (
        <div
          className="absolute pointer-events-none z-20 bg-white/95 backdrop-blur-sm border border-green-200 rounded-lg px-3 py-2 shadow-lg"
          style={{
            left: Math.min(tooltipPos.x + 10, width - 150),
            top: tooltipPos.y - 60,
            minWidth: '120px',
          }}
        >
          <p className="text-sm font-medium text-neutral-800">{hoveredSkill.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
              hoveredSkill.level >= 6 ? 'bg-amber-100 text-amber-700' :
              hoveredSkill.level >= 4 ? 'bg-green-600 text-white' :
              hoveredSkill.level >= 2 ? 'bg-green-400 text-white' :
              'bg-green-200 text-green-700'
            }`}>
              L{hoveredSkill.level}
            </span>
            <span className="text-xs text-neutral-500">
              {getSkillLevelLabel(hoveredSkill.level)}
            </span>
          </div>
          {hoveredSkill.description && (
            <p className="text-xs text-neutral-500 mt-1">{hoveredSkill.description}</p>
          )}
        </div>
      )}
    </div>
  )
}
