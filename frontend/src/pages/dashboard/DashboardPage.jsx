import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../../context/LanguageContext'
import { useDashboard } from '../../hooks/useAnalytics'
import { formatCurrency } from '../../utils/formatCurrency'
import { ShoppingCart, Receipt, Wallet, Package, Plus, BarChart3, Sparkles } from 'lucide-react'

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

const colorClasses = {
  violet: { bg: 'bg-violet-500/10', text: 'text-violet-400', iconBg: 'bg-violet-500/10' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', iconBg: 'bg-red-500/10' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', iconBg: 'bg-blue-500/10' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', iconBg: 'bg-purple-500/10' },
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data, isLoading } = useDashboard()

  const sales = data?.sales
  const expense = data?.expense

  const totalRevenue = sales?.totalRevenue || 0
  const totalTransactions = sales?.totalTransactions || 0
  const totalExpense = expense?.totalExpense || 0
  const netProfit = totalRevenue - totalExpense
  const totalProducts = sales?.topProducts?.length || 0

  const statCards = [
    { key: 'totalRevenue', value: formatCurrency(totalRevenue), change: `${totalTransactions} orders`, color: 'violet', icon: ShoppingCart },
    { key: 'totalExpenses', value: formatCurrency(totalExpense), change: expense?.byCategory?.length ? `${expense.byCategory.length} categories` : '', color: 'red', icon: Wallet },
    { key: 'netProfit', value: formatCurrency(netProfit), change: totalRevenue > 0 ? `${((netProfit / totalRevenue) * 100).toFixed(1)}% margin` : '', color: 'blue', icon: Receipt },
    { key: 'totalProducts', value: totalProducts.toString(), change: 'top sellers', color: 'purple', icon: Package },
  ]

  const revenueByDay = sales?.revenueByDay || []
  const topProducts = sales?.topProducts || []
  const expenseByCategory = expense?.byCategory || []

  const quickActions = [
    { label: t('dashboard.addNewProduct'), icon: Plus, action: () => navigate('/products') },
    { label: t('dashboard.recordSale'), icon: ShoppingCart, action: () => navigate('/sales') },
    { label: t('dashboard.addExpense'), icon: Wallet, action: () => navigate('/expenses') },
    { label: t('dashboard.viewReports'), icon: Sparkles, action: () => navigate('/ai') },
  ]

  const maxRevenue = revenueByDay.length > 0 ? Math.max(...revenueByDay.map(d => d.revenue)) : 1

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
                <card.icon className={`w-5 h-5 ${colorClasses[card.color].text}`} />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl font-bold text-white">{isLoading ? '...' : card.value}</p>
              <p className={`text-xs mt-1 ${colorClasses[card.color].text}`}>{isLoading ? '...' : card.change}</p>
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
          {revenueByDay.length > 0 ? (
            <>
              <div className="flex items-end gap-2 h-48">
                {revenueByDay.slice(-7).map((item, i) => (
                  <div key={item._id} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center gap-1" style={{ height: '160px' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="w-full bg-gradient-to-t from-violet-500 to-purple-400 rounded-t-lg"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">{item._id?.slice(5) || ''}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  <span className="text-xs text-slate-400">{t('dashboard.revenue')}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              {isLoading ? 'Loading...' : 'No revenue data yet'}
            </div>
          )}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">{t('dashboard.quickActions')}</h3>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          variants={fadeInUp}
          className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <span className="text-violet-400 text-xs font-bold">#{i + 1}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{product.productName}</span>
                  </div>
                  <span className="text-sm font-semibold text-violet-400">{formatCurrency(product.revenue)}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-slate-500">
              {isLoading ? 'Loading...' : 'No products sold yet'}
            </div>
          )}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Expense Breakdown</h3>
          {expenseByCategory.length > 0 ? (
            <div className="space-y-3">
              {expenseByCategory.map((cat, i) => {
                const percentage = totalExpense > 0 ? ((cat.total / totalExpense) * 100).toFixed(1) : 0
                return (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white capitalize">{cat._id}</span>
                      <span className="text-sm text-slate-400">{formatCurrency(cat.total)} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.5 }}
                        className="bg-red-400 h-1.5 rounded-full"
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-slate-500">
              {isLoading ? 'Loading...' : 'No expenses yet'}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
