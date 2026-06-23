import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../utils/cn'
import { slideUp } from '../../lib/motion'

const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => {
    const num = Math.round(v)
    if (prefix === '$') return '$' + num.toLocaleString()
    return prefix + num.toLocaleString() + suffix
  })

  useEffect(() => {
    const controls = animate(count, Number(value) || 0, {
      duration: 1.2,
      ease: 'easeOut',
    })
    return controls.stop
  }, [value, count])

  return <motion.span>{rounded}</motion.span>
}

const colorConfig = {
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  green: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
  },
  yellow: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
  purple: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
  },
}

export default function StatCard({ title, value, rawValue, prefix, suffix, subtitle, icon: Icon, trend, color = 'blue', loading, className = '' }) {
  const c = colorConfig[color] || colorConfig.blue

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6
                      border border-gray-800/60
                      shadow-card animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 bg-gray-800 rounded-full w-24" />
          <div className="h-10 w-10 bg-gray-800 rounded-xl" />
        </div>
        <div className="h-8 bg-gray-800 rounded-full w-32 mb-2" />
        <div className="h-3 bg-gray-800 rounded-full w-20" />
      </div>
    )
  }

  const displayPrefix = prefix || (typeof value === 'string' && value.startsWith('$') ? '$' : '')

  return (
    <motion.div
      variants={slideUp}
      whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(139,92,246,0.12)' }}
      transition={{ duration: 0.2 }}
      className={cn(
        'bg-gray-900 rounded-2xl p-6',
        'border border-gray-800/60',
        'shadow-card cursor-default',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className={cn('p-2.5 rounded-xl', c.bg)}>
            <span className={c.text}>{Icon}</span>
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-white mb-1">
        {rawValue !== undefined ? (
          <AnimatedNumber value={rawValue} prefix={displayPrefix} suffix={suffix} />
        ) : (
          value
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-gray-400">{subtitle}</p>
      )}

      {trend !== undefined && trend !== null && (
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className={cn(
            'flex items-center gap-1 text-xs mt-2 font-medium',
            Number(trend) >= 0 ? 'text-violet-400' : 'text-red-400'
          )}
        >
          {Number(trend) >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span>{Number(trend) >= 0 ? '+' : ''}{Number(trend)}%</span>
          <span className="text-gray-500 font-normal">vs last period</span>
        </motion.div>
      )}
    </motion.div>
  )
}
