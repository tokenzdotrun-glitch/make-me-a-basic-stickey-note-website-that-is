# StickyCA — Customizable Sticky Notes with Live Token Data

A draggable board of sticky notes that you can fully customize (colors, gradients,
accent, fonts, size, tilt) — and each note can pin a **token contract address** to
show **live price, market cap, volume, liquidity and price changes**, DEX-dashboard
style. Live data comes from the free [DexScreener](https://dexscreener.com) public
API (any chain, no key required).

## Features
- 🗒️ **Sticky notes board** — drag anywhere, resize, bring-to-front, auto-saved to `localStorage`.
- 💰 **Token notes** — paste any contract address (EVM `0x…` or Solana mint) to track it live.
  - Price (with DexScreener-style subscript notation for tiny prices)
  - 5m / 1h / 6h / 24h price changes
  - Market cap, liquidity, 24h volume, pair age, DEX & chain
  - Token logo + link to DexScreener, auto-refresh every 30s
- 🎨 **Deep customization** — 12 theme presets, custom background / accent / text colors,
  5 fonts, adjustable text size and tilt, compact/detailed token layout.
- 📝 Toggle any note between plain text and token mode.

## Develop
```bash
npm install
npm run dev
```

## Build
```bash
npm run build          # type-check + production build
npm run build:preview  # single self-contained index.html (dist-preview/)
```

## Stack
Vite · React · TypeScript · Tailwind CSS. No backend — it's a static SPA that calls
the DexScreener public API directly from the browser.
