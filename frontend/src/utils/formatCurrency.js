export function formatCurrency(amount) {
  const num = Number(amount) || 0
  return `$${num.toLocaleString('en-US')}`
}

export function formatCurrencyFull(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
}

export default formatCurrency
