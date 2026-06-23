import { cn } from '../../utils/cn'

export function Pagination({
  page,
  pageCount,
  onPageChange,
  showPageNumbers = true,
  maxPageNumbers = 5,
  className = '',
}) {
  if (pageCount <= 1) return null

  const pages = []
  if (showPageNumbers) {
    let start = Math.max(1, page - Math.floor(maxPageNumbers / 2))
    let end = Math.min(pageCount, start + maxPageNumbers - 1)

    if (end - start + 1 < maxPageNumbers) {
      start = Math.max(1, end - maxPageNumbers + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return (
    <nav
      className={cn('flex items-center justify-center gap-1', className)}
      aria-label="Pagination"
    >
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className={cn(
          'p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors'
        )}
        aria-label="First page"
      >
        ««
      </button>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={cn(
          'p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors'
        )}
        aria-label="Previous page"
      >
        «
      </button>

      {showPageNumbers && pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={cn(
            'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            p === page
              ? 'bg-primary text-white'
              : 'text-gray-300 bg-gray-800 border border-gray-700 hover:bg-gray-700'
          )}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        className={cn(
          'p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors'
        )}
        aria-label="Next page"
      >
        »
      </button>
      <button
        onClick={() => onPageChange(pageCount)}
        disabled={page === pageCount}
        className={cn(
          'p-2 text-gray-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors'
        )}
        aria-label="Last page"
      >
        »»
      </button>
    </nav>
  )
}
