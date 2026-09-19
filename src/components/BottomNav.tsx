import { NavLink } from 'react-router-dom'

export interface NavItem {
  path: string
  label: string
  icon: (active: boolean) => JSX.Element
}

export interface BottomNavProps {
  items: NavItem[]
  className?: string
}

const BottomNav = ({ items, className = '' }: BottomNavProps) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 safe-bottom z-50 ${className}`}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                isActive ? 'text-green-600' : 'text-neutral-500 hover:text-neutral-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="mb-0.5">{item.icon(isActive)}</span>
                <span className="text-xs font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

// 预设的五个导航项图标
export const HomeIcon = (active: boolean) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? '2' : '1.75'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

export const LifeIcon = (active: boolean) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? '2' : '1.75'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

export const GrowthIcon = (active: boolean) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? '2' : '1.75'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 20V10" />
    <path d="M12 20V4" />
    <path d="M6 20v-6" />
  </svg>
)

export const ExperimentIcon = (active: boolean) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? '2' : '1.75'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 2v7.31" />
    <path d="M14 9.3V1.99" />
    <path d="M8.5 2h7" />
    <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
    <path d="M5.52 16h12.96" />
  </svg>
)

export const ProfileIcon = (active: boolean) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? '2' : '1.75'}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

// 默认导航配置
export const defaultNavItems: NavItem[] = [
  { path: '/', label: '首页', icon: HomeIcon },
  { path: '/life', label: '人生', icon: LifeIcon },
  { path: '/growth', label: '成长', icon: GrowthIcon },
  { path: '/experiment', label: '实验', icon: ExperimentIcon },
  { path: '/profile', label: '我的', icon: ProfileIcon },
]

export default BottomNav
