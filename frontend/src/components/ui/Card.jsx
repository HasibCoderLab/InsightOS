import { cn } from '../../utils/cn'

export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={cn(
        'bg-gray-900 rounded-2xl border border-gray-800/60',
        'shadow-sm transition-all',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card

export function CardHeader({ className = '', children, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-800', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className = '', children, ...props }) {
  return (
    <h3 className={cn('text-lg font-semibold text-white', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ className = '', children, ...props }) {
  return (
    <p className={cn('text-sm text-gray-400 mt-1', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={cn('px-6 py-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className = '', children, ...props }) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-800 bg-gray-800/50 rounded-b-2xl', className)} {...props}>
      {children}
    </div>
  )
}
