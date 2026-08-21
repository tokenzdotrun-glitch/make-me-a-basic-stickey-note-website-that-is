/** Number & price formatting helpers used by token cards. */

const SUBSCRIPTS = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉']

function toSubscript(n: number): string {
  return String(n)
    .split('')
    .map((d) => SUBSCRIPTS[Number(d)] ?? d)
    .join('')
}

/**
 * Format a USD price. Very small prices use DexScreener-style subscript
 * notation for the leading zeros (e.g. $0.0₅3991).
 */
export function formatPrice(value?: string | number): string {
  if (value == null) return '—'
  const n = typeof value === 'string' ? Number(value) : value
  if (!isFinite(n) || n === 0) return '$0'

  if (n >= 1) {
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  }
  if (n >= 0.01) {
    return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 4 })
  }

  // Count leading zeros after the decimal point.
  const str = n.toFixed(20)
  const decimals = str.split('.')[1] ?? ''
  let zeros = 0
  for (const ch of decimals) {
    if (ch === '0') zeros++
    else break
  }
  const significant = decimals.slice(zeros).replace(/0+$/, '').slice(0, 4) || '0'
  if (zeros <= 3) {
    return '$0.' + '0'.repeat(zeros) + significant
  }
  return `$0.0${toSubscript(zeros)}${significant}`
}

/** Compact currency like $1.65B, $7.08M, $12.3K. */
export function formatCompact(value?: number): string {
  if (value == null || !isFinite(value)) return '—'
  if (value === 0) return '$0'
  return (
    '$' +
    Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value)
  )
}

/** Signed percentage like +25.31% / -1.35%. */
export function formatPct(value?: number): string {
  if (value == null || !isFinite(value)) return '—'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/** Relative age string from a timestamp (ms). */
export function formatAge(ms?: number): string {
  if (!ms) return '—'
  const diff = Date.now() - ms
  const days = Math.floor(diff / 86_400_000)
  if (days >= 365) return `${Math.floor(days / 365)}y`
  if (days >= 1) return `${days}d`
  const hours = Math.floor(diff / 3_600_000)
  if (hours >= 1) return `${hours}h`
  const mins = Math.floor(diff / 60_000)
  return `${Math.max(mins, 1)}m`
}

/** Shorten an address to 0x1234…abcd. */
export function shortAddr(addr?: string): string {
  if (!addr) return ''
  if (addr.length <= 12) return addr
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}
