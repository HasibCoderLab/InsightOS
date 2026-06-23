import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../context/LanguageContext'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const statCards = [
  { key: 'totalRevenue', value: '$45,231.89', change: '+20.1%', color: 'violet', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'totalExpenses', value: '$12,430.00', change: '+5.2%', color: 'red', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
  { key: 'netProfit', value: '$32,801.89', change: '+24.3%', color: 'blue', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  { key: 'totalProducts', value: '156', change: '+12', color: 'purple', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
]

const colorClasses = {
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', iconBg: 'bg-violet-500/10' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', iconBg: 'bg-red-500/10' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', iconBg: 'bg-blue-500/10' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', iconBg: 'bg-purple-500/10' },
}

const weeklyData = [
  { day: 'Mon', revenue: 4000, expenses: 2400 },
  { day: 'Tue', revenue: 3000, expenses: 1398 },
  { day: 'Wed', revenue: 5000, expenses: 3800 },
  { day: 'Thu', revenue: 2780, expenses: 3908 },
  { day: 'Fri', revenue: 1890, expenses: 4800 },
  { day: 'Sat', revenue: 2390, expenses: 3800 },
  { day: 'Sun', revenue: 3490, expenses: 4300 },
]

const recentSales = [
  { id: 1, customer: 'Olivia Martin', email: 'olivia@email.com', amount: '+$1,999.00' },
  { id: 2, customer: 'Jackson Lee', email: 'jackson@email.com', amount: '+$39.00' },
  { id: 3, customer: 'Isabella Nguyen', email: 'isabella@email.com', amount: '+$299.00' },
  { id: 4, customer: 'William Kim', email: 'will@email.com', amount: '+$99.00' },
  { id: 5, customer: 'Sofia Davis', email: 'sofia@email.com', amount: '+$2,499.00' },
]

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const quickActions = [
    { label: t('dashboard.addNewProduct'), icon: 'M12 6v6m0 0v6m0-6h6m-6 0H6', action: () => navigate('/products') },
    { label: t('dashboard.recordSale'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', action: () => navigate('/sales') },
    { label: t('dashboard.addExpense'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', action: () => navigate('/expenses') },
    { label: t('dashboard.viewReports'), icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', action: () => navigate('/ai') },
  ]

  const maxRevenue = Math.max(...weeklyData.map(d => d.revenue))

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold text-white">{t('dashboard.title')}</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's your business overview.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.key}
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">{t(`dashboard.${card.key}`)}</p>
              <div className={`w-10 h-10 rounded-xl ${colorClasses[card.color].iconBg} flex items-center justify-center`}>
                <svg className={`w-5 h-5 ${colorClasses[card.color].text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className={`text-xs mt-1 ${colorClasses[card.color].text}`}>{card.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.weeklyTrend')}</h3>
          <div className="flex items-end gap-3 h-48">
            {weeklyData.map((item, i) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1" style={{ height: '160px' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-full bg-gradient-to-t from-violet-500 to-purple-400 rounded-t-lg"
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.expenses / maxRevenue) * 100}%` }}
                    transition={{ delay: i * 0.1 + 0.2, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-full bg-gradient-to-t from-red-400 to-orange-300 rounded-t-lg"
                  />
                </div>
                <span className="text-xs text-slate-400">{item.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-xs text-slate-400">{t('dashboard.revenue')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <span className="text-xs text-slate-400">{t('dashboard.expenses')}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.quickActions')}</h3>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.label}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-300">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={fadeInUp}
        className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.recentSales')}</h3>
        <div className="space-y-4">
          {recentSales.map((sale, i) => (
            <motion.div
              key={sale.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{sale.customer.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{sale.customer}</p>
                  <p className="text-xs text-slate-400">{sale.email}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-violet-400">{sale.amount}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
