import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '../../context/LanguageContext'
import { useQuery } from '@tanstack/react-query'
import { authApi } from '../../api/auth.api'
import { API_URL } from '../../utils/config'

export default function Topbar({ onMenuToggle }) {
  const { t } = useTranslation()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  const { data: userData } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.getMe()
      return res.data.data.user
    },
    staleTime: 10 * 60 * 1000,
  })

  const firstLetter = userData?.name?.[0]?.toUpperCase() ?? '?'
  const avatarSrc = userData?.avatar ? `${API_URL}${userData.avatar}` : null

  return (
    <header className="h-16 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border-0 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer shadow-md shadow-violet-500/20 overflow-hidden"
            >
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                firstLetter
              )}
            </motion.div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 py-2 z-50"
              >
                <button
                  onClick={() => {
                    navigate('/profile')
                    setShowProfileMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  {t('settings.profile')}
                </button>
                <button
                  onClick={() => {
                    navigate('/settings')
                    setShowProfileMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  {t('nav.settings')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
