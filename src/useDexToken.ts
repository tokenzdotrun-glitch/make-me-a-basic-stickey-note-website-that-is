import { useCallback, useEffect, useRef, useState } from 'react'
import type { DexPair } from './types'

type State = {
  pair: DexPair | null
  loading: boolean
  error: string | null
  updatedAt: number | null
}

const REFRESH_MS = 30_000

/** Pick the most relevant pair (highest USD liquidity) for a token. */
function pickBestPair(pairs: DexPair[]): DexPair | null {
  if (!pairs || pairs.length === 0) return null
  return [...pairs].sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0]
}

/**
 * Fetch & auto-refresh live token data from the DexScreener public API for a
 * given contract address. Works across all supported chains — no key needed.
 */
export function useDexToken(ca: string, enabled: boolean) {
  const [state, setState] = useState<State>({
    pair: null,
    loading: false,
    error: null,
    updatedAt: null,
  })
  const timerRef = useRef<number | null>(null)

  const fetchData = useCallback(
    async (signal?: AbortSignal, silent = false) => {
      const address = ca.trim()
      if (!address) return
      if (!silent) setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const res = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(address)}`,
          { signal },
        )
        if (!res.ok) throw new Error(`Request failed (${res.status})`)
        const data = (await res.json()) as { pairs?: DexPair[] }
        const best = pickBestPair(data.pairs ?? [])
        if (!best) {
          setState({ pair: null, loading: false, error: 'No token found for this address.', updatedAt: Date.now() })
          return
        }
        setState({ pair: best, loading: false, error: null, updatedAt: Date.now() })
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setState((s) => ({ ...s, loading: false, error: (err as Error).message || 'Failed to load token.' }))
      }
    },
    [ca],
  )

  useEffect(() => {
    if (!enabled || !ca.trim()) {
      setState({ pair: null, loading: false, error: null, updatedAt: null })
      return
    }
    const controller = new AbortController()
    fetchData(controller.signal)

    timerRef.current = window.setInterval(() => {
      fetchData(undefined, true)
    }, REFRESH_MS)

    return () => {
      controller.abort()
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [ca, enabled, fetchData])

  const refresh = useCallback(() => fetchData(undefined, false), [fetchData])

  return { ...state, refresh }
}
