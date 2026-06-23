import { cn } from '../../utils/cn'
import { Loader2 } from 'lucide-react'

export function Table({ columns, data, loading, emptyMessage, className = '', children, ...props }) {
  if (columns && data !== undefined) {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )
    }

    if (!data.length) {
      return (
        <div className="text-center py-12 text-gray-400">
          {emptyMessage || 'No data available.'}
        </div>
      )
    }

    return (
      <div className="overflow-x-auto rounded-xl border border-gray-800/60">
        <table className={cn('w-full text-sm', className)} {...props}>
          <thead className="bg-gray-800/60">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {data.map((row, rowIdx) => (
              <tr
                key={row._id || rowIdx}
                className="hover:bg-gray-800/40 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3.5 text-sm text-gray-100"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ className = '', children, ...props }) {
  return (
    <thead className={cn('bg-gray-800/60', className)} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ className = '', children, ...props }) {
  return (
    <tbody className={cn('divide-y divide-gray-800/60', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ className = '', hover = true, children, ...props }) {
  return (
    <tr
      className={cn(
        'transition-colors',
        hover && 'hover:bg-gray-800/40',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ className = '', children, ...props }) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ className = '', children, ...props }) {
  return (
    <td className={cn('px-4 py-3.5 text-sm text-gray-100', className)} {...props}>
      {children}
    </td>
  )
}

export function TablePagination({
  page,
  pageCount,
  onPageChange,
  className = '',
}) {
  if (pageCount <= 1) return null

  return (
    <div className={cn('flex items-center justify-between px-4 py-3 border-t border-gray-800/60', className)}>
      <div className="text-sm text-gray-400">
        Page {page} of {pageCount}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          className="px-3 py-1 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
