import { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav, { NavItem, defaultNavItems } from './BottomNav'
import InstallPWAPrompt from './InstallPWAPrompt'

export interface LayoutProps {
  children?: ReactNode
  /** 顶部标题 */
  title?: string
  /** 顶部右侧操作区域 */
  headerRight?: ReactNode
  /** 是否显示底部导航，默认 true */
  showBottomNav?: boolean
  /** 自定义导航项，不传则使用默认五项 */
  navItems?: NavItem[]
  /** 自定义容器类名 */
  className?: string
  /** 是否显示顶部安全区域，默认 true */
  safeTop?: boolean
}

const Layout = ({
  children,
  title,
  headerRight,
  showBottomNav = true,
  navItems,
  className = '',
  safeTop = true,
}: LayoutProps) => {
  const items = navItems || defaultNavItems

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {/* 顶部区域 */}
      {(title || headerRight) && (
        <header
          className={`sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 ${
            safeTop ? 'safe-top' : ''
          }`}
        >
          <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
            {title ? (
              <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
            ) : (
              <div className="flex-1" />
            )}
            {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
          </div>
        </header>
      )}

      {/* 主内容区 */}
      <main
        className={`flex-1 ${showBottomNav ? 'pb-20' : ''} ${
          title || headerRight ? '' : safeTop ? 'safe-top' : ''
        } ${className}`}
      >
        <div className="max-w-lg mx-auto animate-fade-in">{children || <Outlet />}</div>
      </main>

      {/* 底部导航 */}
      {showBottomNav && <BottomNav items={items} />}

      {/* PWA 安装提示 */}
      <InstallPWAPrompt />
    </div>
  )
}

export default Layout
