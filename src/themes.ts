import type { NoteTheme } from './types'

/** Font family options users can pick per note. */
export const FONTS: { key: string; label: string; stack: string }[] = [
  { key: 'hand', label: 'Handwritten', stack: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", cursive' },
  { key: 'sans', label: 'Sans', stack: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
  { key: 'serif', label: 'Serif', stack: 'Georgia, "Times New Roman", serif' },
  { key: 'mono', label: 'Mono', stack: '"SF Mono", "JetBrains Mono", "Courier New", monospace' },
  { key: 'rounded', label: 'Rounded', stack: '"Trebuchet MS", "Segoe UI", Verdana, sans-serif' },
]

export function fontStack(key: string): string {
  return FONTS.find((f) => f.key === key)?.stack ?? FONTS[0].stack
}

/** Curated theme presets — solid pastels and rich gradients. */
export const THEMES: { name: string; theme: NoteTheme }[] = [
  { name: 'Lemon', theme: { bg: '#fef08a', accent: '#ca8a04', text: '#3f3300', font: 'hand' } },
  { name: 'Coral', theme: { bg: '#fecaca', accent: '#dc2626', text: '#4c0519', font: 'hand' } },
  { name: 'Mint', theme: { bg: '#bbf7d0', accent: '#059669', text: '#052e16', font: 'hand' } },
  { name: 'Sky', theme: { bg: '#bfdbfe', accent: '#2563eb', text: '#0c1e5b', font: 'hand' } },
  { name: 'Grape', theme: { bg: '#f5d0fe', accent: '#c026d3', text: '#4a044e', font: 'hand' } },
  { name: 'Peach', theme: { bg: '#fed7aa', accent: '#ea580c', text: '#4a1c03', font: 'hand' } },
  {
    name: 'Neon',
    theme: { bg: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)', accent: '#22d3ee', text: '#e2e8f0', font: 'mono' },
  },
  {
    name: 'Sunset',
    theme: { bg: 'linear-gradient(160deg, #fb7185 0%, #f59e0b 100%)', accent: '#7c2d12', text: '#3b0764', font: 'rounded' },
  },
  {
    name: 'Aurora',
    theme: { bg: 'linear-gradient(160deg, #34d399 0%, #3b82f6 100%)', accent: '#052e16', text: '#062056', font: 'sans' },
  },
  {
    name: 'Matrix',
    theme: { bg: 'linear-gradient(160deg, #052e16 0%, #064e3b 100%)', accent: '#4ade80', text: '#bbf7d0', font: 'mono' },
  },
  {
    name: 'Midnight',
    theme: { bg: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)', accent: '#a78bfa', text: '#ede9fe', font: 'sans' },
  },
  {
    name: 'Slate',
    theme: { bg: 'linear-gradient(160deg, #f8fafc 0%, #e2e8f0 100%)', accent: '#334155', text: '#0f172a', font: 'sans' },
  },
]

export const DEFAULT_THEME: NoteTheme = THEMES[0].theme

/** Small swatch list for the quick color picker. */
export const QUICK_COLORS = [
  '#fef08a', '#fecaca', '#bbf7d0', '#bfdbfe', '#f5d0fe', '#fed7aa',
  '#0f172a', '#1e1b4b', '#052e16', '#7c2d12', '#831843', '#ffffff',
]
