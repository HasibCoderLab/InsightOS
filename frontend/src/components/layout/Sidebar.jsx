import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '../../context/LanguageContext'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '../../api/auth.api'
import { API_URL } from '../../utils/config'
import {
  LayoutDashboard,
  Package,
  Receipt,
  Wallet,
  Sparkles,
  Settings,
  ChevronLeft,
} from 'lucide-react'

const sidebarVariants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 30 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, type: 'spring', stiffness: 300, damping: 24 },
  }),
}

const navItems = [
  { to: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { to: '/products', icon: Package, labelKey: 'nav.products' },
  { to: '/sales', icon: Receipt, labelKey: 'nav.sales' },
  { to: '/expenses', icon: Wallet, labelKey: 'nav.expenses' },
  { to: '/ai', icon: Sparkles, labelKey: 'nav.aiAssistant' },
]

const bottomItems = [
  { to: '/settings', icon: Settings, labelKey: 'nav.settings' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: userData, isPending } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.getMe()
      return res.data.data.user
    },
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })

  const firstLetter = userData?.name?.[0]?.toUpperCase() ?? '?'
  const displayName = userData?.name ?? ''
  const displayEmail = userData?.email ?? ''
  const avatarSrc = userData?.avatar ? `${API_URL}${userData.avatar}` : null

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] h-screen flex-shrink-0 flex flex-col
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
          dark:from-slate-950 dark:via-slate-950 dark:to-black
          border-r border-white/[0.06]
          transform lg:transform-none transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-[72px] flex items-center gap-3 px-5 border-b border-white/[0.06]">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white text-sm font-bold tracking-tight">I</span>
            </div>
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-20 blur-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-white tracking-tight leading-none">
              InsightOS
            </span>
            <span className="text-[10px] font-medium text-violet-400/80 tracking-widest uppercase mt-0.5">
              Business Suite
            </span>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
            Menu
          </p>
          {navItems.map((item, i) => (
            <motion.div key={item.to} custom={i} variants={itemVariants} initial="hidden" animate="visible">
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-violet-400 to-fuchsia-500 rounded-r-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon
                      className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200 ${
                        isActive
                          ? 'text-violet-400'
                          : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                      strokeWidth={1.8}
                    />
                    <span className="flex-1">{t(item.labelKey)}</span>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="px-3 pb-2 space-y-0.5">
          {bottomItems.map((item, i) => (
            <motion.div key={item.to} custom={navItems.length + i} variants={itemVariants} initial="hidden" animate="visible">
              <NavLink
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/[0.08] text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-violet-400 to-fuchsia-500 rounded-r-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon
                      className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200 ${
                        isActive
                          ? 'text-violet-400'
                          : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                      strokeWidth={1.8}
                    />
                    <span className="flex-1">{t(item.labelKey)}</span>
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-white/[0.06]" />

        {/* User Profile */}
        <div className="p-3">
          {isPending ? (
            <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex-shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3 bg-white/10 rounded w-24" />
                <div className="h-2.5 bg-white/10 rounded w-32" />
              </div>
            </div>
          ) : (
            <motion.div
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
              onClick={() => { navigate('/profile'); onClose?.() }}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/20 overflow-hidden">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    firstLetter
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-white truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
                  {displayEmail}
                </p>
              </div>
              <ChevronLeft size={14} className="text-slate-600 flex-shrink-0 rotate-180" />
            </motion.div>
          )}
        </div>
      </motion.aside>
    </>
  )
}
