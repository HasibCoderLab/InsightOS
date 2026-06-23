import { cn } from '../../utils/cn'

export function Spinner({ size = 'md', className = '', ...props }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-primary border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function PageSpinner({ className = '' }) {
  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-[#0a0f1e]', className)}>
      <Spinner size="lg" />
    </div>
  )
}

export function InlineSpinner({ className = '' }) {
  return (
    <Spinner size="sm" className={cn('ml-2', className)} />
  )
}
