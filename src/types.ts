export type NoteType = 'text' | 'token'

export type NoteTheme = {
  /** CSS background (solid color or gradient) */
  bg: string
  /** Accent color used for headers, borders, highlights */
  accent: string
  /** Text color for note body */
  text: string
  /** Font family stack key (see FONTS) */
  font: string
}

export type Note = {
  id: string
  type: NoteType
  title: string
  body: string
  /** Token contract address for token notes */
  ca: string
  x: number
  y: number
  width: number
  height: number
  z: number
  rotation: number
  fontSize: number
  theme: NoteTheme
  /** Compact vs. detailed token layout */
  compact: boolean
}

/** Shape of a single trading pair returned by the DexScreener API. */
export type DexPair = {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: { address: string; name: string; symbol: string }
  quoteToken: { address: string; name: string; symbol: string }
  priceUsd?: string
  priceNative?: string
  txns?: Record<string, { buys: number; sells: number }>
  volume?: Record<string, number>
  priceChange?: Record<string, number>
  liquidity?: { usd?: number; base?: number; quote?: number }
  fdv?: number
  marketCap?: number
  pairCreatedAt?: number
  info?: {
    imageUrl?: string
    websites?: { url: string; label?: string }[]
    socials?: { url: string; type: string }[]
  }
}
