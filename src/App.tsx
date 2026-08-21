import { useEffect, useState } from 'react'

type Note = {
  id: string
  text: string
  color: string
}

const COLORS = ['#fef08a', '#fecaca', '#bbf7d0', '#bfdbfe', '#f5d0fe', '#fed7aa']

const STORAGE_KEY = 'sticky-notes'

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

export default function App() {
  const [notes, setNotes] = useState<Note[]>(loadNotes)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    const color = COLORS[notes.length % COLORS.length]
    setNotes((prev) => [{ id: newId(), text: '', color }, ...prev])
  }

  const updateNote = (id: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)))
  }

  const setColor = (id: string, color: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, color } : n)))
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">📝 Sticky Notes</h1>
            <p className="text-sm text-slate-500">Jot it down. Saved in your browser.</p>
          </div>
          <button
            onClick={addNote}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            + New note
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {notes.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center text-slate-400">
            <div className="text-6xl">🗒️</div>
            <p className="mt-4 text-lg font-medium">No notes yet</p>
            <p className="text-sm">Click “New note” to create your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="group flex flex-col rounded-md p-4 shadow-md transition hover:-rotate-1 hover:shadow-xl"
                style={{ backgroundColor: note.color }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        aria-label={`Set color ${c}`}
                        onClick={() => setColor(note.id, c)}
                        className={`h-4 w-4 rounded-full border transition ${
                          note.color === c ? 'border-slate-800' : 'border-black/10'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    aria-label="Delete note"
                    className="rounded px-1.5 text-lg leading-none text-black/40 opacity-0 transition hover:text-black/80 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
                <textarea
                  value={note.text}
                  onChange={(e) => updateNote(note.id, e.target.value)}
                  placeholder="Write something…"
                  className="min-h-[140px] flex-1 resize-none bg-transparent font-hand text-lg leading-snug text-slate-800 placeholder:text-black/30 focus:outline-none"
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
