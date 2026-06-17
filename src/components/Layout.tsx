import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Package, AlertTriangle, ShoppingCart,
  CalendarClock, Scale, ChevronLeft, ChevronRight, Activity
} from 'lucide-react'
import { useAppStore } from '@/store/appStore'

const navItems = [
  { path: '/', label: '全局监控', icon: LayoutDashboard },
  { path: '/inventory', label: '库存分析', icon: Package },
  { path: '/risk', label: '风险识别', icon: AlertTriangle },
  { path: '/procurement', label: '采购建议', icon: ShoppingCart },
  { path: '/scheduling', label: '排程协调', icon: CalendarClock },
  { path: '/balance', label: '平衡分析', icon: Scale },
]

export default function Layout() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <aside
        className={`flex flex-col border-r transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-56'
        }`}
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-3 px-4 h-16 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <Activity className="w-6 h-6 flex-shrink-0" style={{ color: 'var(--accent-amber)' }} />
          {!sidebarCollapsed && (
            <span className="font-mono font-bold text-sm whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
              SupplyChain OS
            </span>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'nav-item-active' : ''} ${sidebarCollapsed ? 'justify-center px-2' : ''}`
              }
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center h-12 border-t transition-colors"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
