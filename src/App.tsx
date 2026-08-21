import { useCallback, useEffect, useRef, useState } from 'react'
import type { Note, NoteType } from './types'
import { THEMES, DEFAULT_THEME } from './themes'
import StickyNote from './StickyNote'

const STORAGE_KEY = 'sticky-notes-board-v2'

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Note[]
  } catch {
    // ignore malformed storage
  }
  return []
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

/** A few well-known tokens to seed a demo board. */
const DEMO_TOKENS = [
  { ca: '0x6982508145454ce325ddbe47a25d4ec3d2311933', title: 'PEPE' },
  { ca: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', title: 'USDC (SOL)' },
]

export default function App() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)
  const boardRef = useRef<HTMLDivElement>(null)
  const zCounter = useRef<number>(
    notes.reduce((max, n) => Math.max(max, n.z), 0),
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  const nextPos = useCallback(() => {
    const board = boardRef.current
    const scrollX = board?.scrollLeft ?? 0
    const scrollY = board?.scrollTop ?? 0
    const jitter = notes.length * 26
    return {
      x: 40 + scrollX + (jitter % 320),
      y: 30 + scrollY + (jitter % 200),
    }
  }, [notes.length])

  const addNote = useCallback(
    (type: NoteType, seed?: { ca?: string; title?: string }) => {
      const pos = nextPos()
      const preset = THEMES[notes.length % THEMES.length].theme
      const note: Note = {
        id: newId(),
        type,
        title: seed?.title ?? '',
        body: '',
        ca: seed?.ca ?? '',
        x: pos.x,
        y: pos.y,
        width: type === 'token' ? 280 : 240,
        height: type === 'token' ? 340 : 220,
        z: ++zCounter.current,
        rotation: Math.round((Math.random() - 0.5) * 6),
        fontSize: 16,
        theme: type === 'token' ? THEMES[6].theme : preset ?? DEFAULT_THEME,
        compact: false,
      }
      setNotes((prev) => [...prev, note])
    },
    [nextPos, notes.length],
  )

  const updateNote = useCallback((id: string, patch: Partial<Note>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const focusNote = useCallback((id: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, z: ++zCounter.current } : n)))
  }, [])

  const clearAll = () => {
    if (notes.length && confirm('Delete all notes? This cannot be undone.')) {
      setNotes([])
    }
  }

  const loadDemo = () => {
    let x = 40
    const created: Note[] = DEMO_TOKENS.map((t, i) => ({
      id: newId(),
      type: 'token' as NoteType,
      title: t.title,
      body: '',
      ca: t.ca,
      x: (x += 40) + i * 260,
      y: 40 + (i % 2) * 30,
      width: 280,
      height: 340,
      z: ++zCounter.current,
      rotation: Math.round((Math.random() - 0.5) * 6),
      fontSize: 16,
      theme: THEMES[(6 + i) % THEMES.length].theme,
      compact: false,
    }))
    setNotes((prev) => [...prev, ...created])
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* Toolbar */}
      <header className="z-10 flex flex-wrap items-center gap-3 border-b border-white/10 bg-slate-900/80 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🗒️</span>
          <div className="leading-tight">
            <h1 className="text-lg font-black tracking-tight">
              Sticky<span className="text-cyan-400">CA</span>
            </h1>
            <p className="text-[11px] text-slate-400">Customizable notes with live token data</p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            onClick={() => addNote('text')}
            className="rounded-lg bg-white/10 px-3 py-2 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95"
          >
            + Note
          </button>
          <button
            onClick={() => addNote('token')}
            className="rounded-lg bg-cyan-500 px-3 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 active:scale-95"
          >
            + Token 💰
          </button>
          <button
            onClick={clearAll}
            className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
          >
            Clear
          </button>
        </div>
      </header>

      {/* Board */}
      <main
        ref={boardRef}
        className="relative flex-1 overflow-auto"
        style={{
          backgroundColor: '#0b1220',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)',
          backgroundSize: '26px 26px',
        }}
      >
        {notes.length === 0 ? (
          <div className="pointer-events-none flex h-full flex-col items-center justify-center text-center">
            <div className="text-7xl">🗒️💰</div>
            <p className="mt-5 text-2xl font-black">Your board is empty</p>
            <p className="mt-1 max-w-md text-slate-400">
              Add a sticky note, or drop in a token contract address to pin live price, market cap
              and volume — fully customizable, just like a DEX dashboard.
            </p>
            <div className="pointer-events-auto mt-6 flex gap-3">
              <button
                onClick={() => addNote('token')}
                className="rounded-lg bg-cyan-500 px-5 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-400 active:scale-95"
              >
                + Add a token note
              </button>
              <button
                onClick={loadDemo}
                className="rounded-lg border border-white/15 px-5 py-2.5 font-bold text-slate-200 transition hover:bg-white/5 active:scale-95"
              >
                Load demo tokens
              </button>
            </div>
          </div>
        ) : (
          <div className="relative min-h-full min-w-full" style={{ width: 2400, height: 1600 }}>
            {notes.map((note) => (
              <StickyNote
                key={note.id}
                note={note}
                onChange={(patch) => updateNote(note.id, patch)}
                onDelete={() => deleteNote(note.id)}
                onFocus={() => focusNote(note.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
