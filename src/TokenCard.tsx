import { useState } from 'react'
import { useDexToken } from './useDexToken'
import { formatPrice, formatCompact, formatPct, formatAge, shortAddr } from './format'
import type { DexPair } from './types'

const CHAIN_LABELS: Record<string, string> = {
  ethereum: 'ETH',
  bsc: 'BSC',
  solana: 'SOL',
  base: 'BASE',
  arbitrum: 'ARB',
  polygon: 'POLY',
  avalanche: 'AVAX',
  optimism: 'OP',
  pulsechain: 'PLS',
  fantom: 'FTM',
  sui: 'SUI',
  ton: 'TON',
  tron: 'TRX',
}

function chainLabel(id: string): string {
  return CHAIN_LABELS[id] ?? id.slice(0, 4).toUpperCase()
}

function ChangeCell({ label, value }: { label: string; value?: number }) {
  const up = (value ?? 0) >= 0
  const color = value == null ? 'inherit' : up ? '#16a34a' : '#dc2626'
  return (
    <div className="flex flex-col items-center rounded-md bg-black/5 px-1.5 py-1">
      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-60">{label}</span>
      <span className="text-xs font-bold" style={{ color }}>
        {formatPct(value)}
      </span>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="font-medium uppercase tracking-wide opacity-55">{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
    </div>
  )
}

function TokenLogo({ pair, accent }: { pair: DexPair; accent: string }) {
  const [broken, setBroken] = useState(false)
  const url = pair.info?.imageUrl
  const symbol = pair.baseToken.symbol
  if (url && !broken) {
    return (
      <img
        src={url}
        alt={symbol}
        onError={() => setBroken(true)}
        className="h-9 w-9 shrink-0 rounded-full object-cover ring-2"
        style={{ ['--tw-ring-color' as string]: accent }}
      />
    )
  }
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
      style={{ background: accent }}
    >
      {symbol.slice(0, 3).toUpperCase()}
    </div>
  )
}

export default function TokenCard({
  ca,
  accent,
  compact,
}: {
  ca: string
  accent: string
  compact: boolean
}) {
  const { pair, loading, error, updatedAt, refresh } = useDexToken(ca, true)

  if (!ca.trim()) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center opacity-60">
        <span className="text-2xl">🔎</span>
        <p className="text-sm font-semibold">Paste a token contract address</p>
        <p className="text-xs">Live price &amp; stats from DexScreener</p>
      </div>
    )
  }

  if (loading && !pair) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 text-sm opacity-70">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading token…
      </div>
    )
  }

  if (error && !pair) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <span className="text-2xl">⚠️</span>
        <p className="text-sm font-semibold">{error}</p>
        <button
          onClick={refresh}
          className="rounded-md px-3 py-1 text-xs font-bold text-white"
          style={{ background: accent }}
        >
          Retry
        </button>
      </div>
    )
  }

  if (!pair) return null

  const symbol = pair.baseToken.symbol
  const name = pair.baseToken.name

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-2">
        <TokenLogo pair={pair} accent={accent} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-black leading-tight">{symbol}</span>
            <span
              className="shrink-0 rounded px-1 py-0.5 text-[9px] font-bold text-white"
              style={{ background: accent }}
            >
              {chainLabel(pair.chainId)}
            </span>
          </div>
          <span className="block truncate text-[11px] opacity-60">{name}</span>
        </div>
        <div className="text-right">
          <div className="text-base font-black leading-none tabular-nums">{formatPrice(pair.priceUsd)}</div>
          <div
            className="text-[11px] font-bold"
            style={{ color: (pair.priceChange?.h24 ?? 0) >= 0 ? '#16a34a' : '#dc2626' }}
          >
            {formatPct(pair.priceChange?.h24)} 24h
          </div>
        </div>
      </div>

      {/* Price change grid */}
      <div className="grid grid-cols-4 gap-1">
        <ChangeCell label="5m" value={pair.priceChange?.m5} />
        <ChangeCell label="1h" value={pair.priceChange?.h1} />
        <ChangeCell label="6h" value={pair.priceChange?.h6} />
        <ChangeCell label="24h" value={pair.priceChange?.h24} />
      </div>

      {!compact && (
        <div className="flex flex-col gap-1 rounded-md bg-black/5 p-2">
          <Stat label="MCap" value={formatCompact(pair.marketCap ?? pair.fdv)} />
          <Stat label="Liq" value={formatCompact(pair.liquidity?.usd)} />
          <Stat label="Vol 24h" value={formatCompact(pair.volume?.h24)} />
          <Stat label="Age" value={formatAge(pair.pairCreatedAt)} />
          <Stat label="DEX" value={pair.dexId} />
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between gap-2 text-[10px] opacity-70">
        <a
          href={pair.url}
          target="_blank"
          rel="noreferrer"
          className="font-bold underline decoration-dotted underline-offset-2 hover:opacity-100"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {shortAddr(pair.baseToken.address)} ↗
        </a>
        <button
          onClick={refresh}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center gap-1 font-semibold hover:opacity-100"
          title="Refresh now"
        >
          <span className={loading ? 'inline-block animate-spin' : 'inline-block'}>↻</span>
          {updatedAt ? new Date(updatedAt).toLocaleTimeString() : ''}
        </button>
      </div>
    </div>
  )
}
