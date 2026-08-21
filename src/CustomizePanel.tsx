import { FONTS, THEMES, QUICK_COLORS } from './themes'
import type { Note } from './types'

export default function CustomizePanel({
  note,
  onChange,
  onClose,
}: {
  note: Note
  onChange: (patch: Partial<Note>) => void
  onClose: () => void
}) {
  const setTheme = (patch: Partial<Note['theme']>) => onChange({ theme: { ...note.theme, ...patch } })

  return (
    <div
      className="absolute right-0 top-9 z-50 w-64 rounded-xl border border-black/10 bg-white p-3 text-slate-800 shadow-2xl"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wide">Customize</span>
        <button onClick={onClose} className="rounded px-1 text-slate-400 hover:text-slate-700">
          ✕
        </button>
      </div>

      {/* Theme presets */}
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Themes</p>
      <div className="mb-3 grid grid-cols-6 gap-1.5">
        {THEMES.map((t) => (
          <button
            key={t.name}
            title={t.name}
            onClick={() => onChange({ theme: t.theme })}
            className="h-7 w-full rounded-md border border-black/10 transition hover:scale-110"
            style={{ background: t.theme.bg }}
          />
        ))}
      </div>

      {/* Background color */}
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Background</p>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {QUICK_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setTheme({ bg: c })}
            className="h-6 w-6 rounded-md border border-black/10 transition hover:scale-110"
            style={{ background: c }}
          />
        ))}
        <label
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md border border-black/10 bg-gradient-to-br from-fuchsia-400 via-yellow-300 to-cyan-400 text-[9px]"
          title="Custom color"
        >
          <input
            type="color"
            className="h-0 w-0 opacity-0"
            onChange={(e) => setTheme({ bg: e.target.value })}
          />
          🎨
        </label>
      </div>

      {/* Accent + text colors */}
      <div className="mb-3 flex gap-3">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold">
          <input
            type="color"
            value={note.theme.accent}
            onChange={(e) => setTheme({ accent: e.target.value })}
            className="h-6 w-6 cursor-pointer rounded border border-black/10 bg-transparent p-0"
          />
          Accent
        </label>
        <label className="flex items-center gap-1.5 text-[11px] font-semibold">
          <input
            type="color"
            value={note.theme.text}
            onChange={(e) => setTheme({ text: e.target.value })}
            className="h-6 w-6 cursor-pointer rounded border border-black/10 bg-transparent p-0"
          />
          Text
        </label>
      </div>

      {/* Font */}
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">Font</p>
      <div className="mb-3 flex flex-wrap gap-1">
        {FONTS.map((f) => (
          <button
            key={f.key}
            onClick={() => setTheme({ font: f.key })}
            className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition ${
              note.theme.font === f.key
                ? 'border-slate-800 bg-slate-800 text-white'
                : 'border-black/10 hover:bg-black/5'
            }`}
            style={{ fontFamily: f.stack }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Font size */}
      <label className="mb-2 block">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Text size · {note.fontSize}px
        </span>
        <input
          type="range"
          min={12}
          max={30}
          value={note.fontSize}
          onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
          className="w-full accent-slate-800"
        />
      </label>

      {/* Rotation */}
      <label className="mb-3 block">
        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          Tilt · {note.rotation}°
        </span>
        <input
          type="range"
          min={-8}
          max={8}
          value={note.rotation}
          onChange={(e) => onChange({ rotation: Number(e.target.value) })}
          className="w-full accent-slate-800"
        />
      </label>

      {note.type === 'token' && (
        <label className="flex cursor-pointer items-center justify-between rounded-md bg-black/5 px-2 py-1.5 text-[11px] font-semibold">
          Compact token view
          <input
            type="checkbox"
            checked={note.compact}
            onChange={(e) => onChange({ compact: e.target.checked })}
            className="h-4 w-4 accent-slate-800"
          />
        </label>
      )}
    </div>
  )
}
