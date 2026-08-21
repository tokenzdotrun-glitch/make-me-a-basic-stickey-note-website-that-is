import { useRef, useState } from 'react'
import type { Note } from './types'
import { fontStack } from './themes'
import TokenCard from './TokenCard'
import CustomizePanel from './CustomizePanel'

type DragState = { startX: number; startY: number; origX: number; origY: number }
type ResizeState = { startX: number; startY: number; origW: number; origH: number }

const MIN_W = 200
const MIN_H = 170

export default function StickyNote({
  note,
  onChange,
  onDelete,
  onFocus,
}: {
  note: Note
  onChange: (patch: Partial<Note>) => void
  onDelete: () => void
  onFocus: () => void
}) {
  const dragRef = useRef<DragState | null>(null)
  const resizeRef = useRef<ResizeState | null>(null)
  const [showCustomize, setShowCustomize] = useState(false)
  const [editingCa, setEditingCa] = useState(note.type === 'token' && !note.ca)
  const [caDraft, setCaDraft] = useState(note.ca)

  // ---- Dragging (via the header grip) ----
  const onDragDown = (e: React.PointerEvent) => {
    onFocus()
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: note.x, origY: note.y }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  const onDragMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    onChange({
      x: Math.max(0, dragRef.current.origX + dx),
      y: Math.max(0, dragRef.current.origY + dy),
    })
  }
  const onDragUp = (e: React.PointerEvent) => {
    dragRef.current = null
    ;(e.currentTarget as Element).releasePointerCapture(e.pointerId)
  }

  // ---- Resizing (via the corner handle) ----
  const onResizeDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    onFocus()
    resizeRef.current = { startX: e.clientX, startY: e.clientY, origW: note.width, origH: note.height }
    ;(e.currentTarget as Element).setPointerCapture(e.pointerId)
  }
  const onResizeMove = (e: React.PointerEvent) => {
    if (!resizeRef.current) return
    const dw = e.clientX - resizeRef.current.startX
    const dh = e.clientY - resizeRef.current.startY
    onChange({
      width: Math.max(MIN_W, resizeRef.current.origW + dw),
      height: Math.max(MIN_H, resizeRef.current.origH + dh),
    })
  }
  const onResizeUp = (e: React.PointerEvent) => {
    resizeRef.current = null
    ;(e.currentTarget as Element).releasePointerCapture(e.pointerId)
  }

  const submitCa = () => {
    onChange({ ca: caDraft.trim() })
    setEditingCa(false)
  }

  const icon = note.theme.text

  return (
    <div
      className="group absolute flex flex-col rounded-lg shadow-lg ring-1 ring-black/5 transition-shadow hover:shadow-2xl"
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: note.z,
        background: note.theme.bg,
        color: note.theme.text,
        fontFamily: fontStack(note.theme.font),
        transform: `rotate(${note.rotation}deg)`,
      }}
      onPointerDown={onFocus}
    >
      {/* Header / drag handle */}
      <div
        className="flex touch-none items-center gap-1 rounded-t-lg px-2 py-1.5"
        style={{ cursor: 'grab', borderBottom: `1px solid ${note.theme.accent}22` }}
        onPointerDown={onDragDown}
        onPointerMove={onDragMove}
        onPointerUp={onDragUp}
      >
        {/* grip dots */}
        <div className="mr-1 flex flex-col gap-[3px] opacity-40">
          <span className="flex gap-[3px]">
            <i className="h-1 w-1 rounded-full" style={{ background: icon }} />
            <i className="h-1 w-1 rounded-full" style={{ background: icon }} />
          </span>
          <span className="flex gap-[3px]">
            <i className="h-1 w-1 rounded-full" style={{ background: icon }} />
            <i className="h-1 w-1 rounded-full" style={{ background: icon }} />
          </span>
        </div>

        <input
          value={note.title}
          onChange={(e) => onChange({ title: e.target.value })}
          onPointerDown={(e) => e.stopPropagation()}
          placeholder={note.type === 'token' ? 'Token note' : 'Title'}
          className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:opacity-40"
          style={{ color: note.theme.text }}
        />

        {/* type toggle */}
        <button
          title={note.type === 'token' ? 'Switch to text note' : 'Switch to token note'}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onChange({ type: note.type === 'token' ? 'text' : 'token' })}
          className="rounded px-1 text-sm opacity-60 hover:opacity-100"
          style={{ color: icon }}
        >
          {note.type === 'token' ? '📝' : '💰'}
        </button>

        {/* customize */}
        <div className="relative">
          <button
            title="Customize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setShowCustomize((v) => !v)}
            className="rounded px-1 text-sm opacity-60 hover:opacity-100"
            style={{ color: icon }}
          >
            🎨
          </button>
          {showCustomize && (
            <CustomizePanel note={note} onChange={onChange} onClose={() => setShowCustomize(false)} />
          )}
        </div>

        {/* delete */}
        <button
          title="Delete note"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onDelete}
          className="rounded px-1 text-base leading-none opacity-40 hover:opacity-100"
          style={{ color: icon }}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col overflow-hidden p-3 pt-2">
        {note.type === 'text' ? (
          <textarea
            value={note.body}
            onChange={(e) => onChange({ body: e.target.value })}
            onPointerDown={(e) => e.stopPropagation()}
            placeholder="Write something…"
            className="flex-1 resize-none bg-transparent leading-snug outline-none placeholder:opacity-30"
            style={{ color: note.theme.text, fontSize: note.fontSize }}
          />
        ) : editingCa || !note.ca ? (
          <div className="flex flex-1 flex-col justify-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wide opacity-60">
              Token contract address
            </label>
            <input
              value={caDraft}
              onChange={(e) => setCaDraft(e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === 'Enter' && submitCa()}
              placeholder="0x… or Solana mint address"
              autoFocus
              className="w-full rounded-md border border-black/10 bg-white/70 px-2 py-1.5 text-xs text-slate-900 outline-none focus:ring-2"
              style={{ ['--tw-ring-color' as string]: note.theme.accent }}
            />
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={submitCa}
              disabled={!caDraft.trim()}
              className="rounded-md px-3 py-1.5 text-xs font-black text-white disabled:opacity-40"
              style={{ background: note.theme.accent }}
            >
              Track token
            </button>
            <p className="text-[10px] opacity-50">Live data via DexScreener · any chain</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden" style={{ fontSize: note.fontSize > 16 ? 16 : note.fontSize }}>
            <div className="mb-1 flex justify-end">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setCaDraft(note.ca)
                  setEditingCa(true)
                }}
                className="text-[10px] font-bold underline decoration-dotted opacity-50 hover:opacity-100"
              >
                edit CA
              </button>
            </div>
            <TokenCard ca={note.ca} accent={note.theme.accent} compact={note.compact} />
          </div>
        )}
      </div>

      {/* Resize handle */}
      <div
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={onResizeUp}
        className="absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize touch-none"
        style={{ color: icon }}
        title="Resize"
      >
        <svg viewBox="0 0 10 10" className="absolute bottom-1 right-1 h-2.5 w-2.5 opacity-40">
          <path d="M9 1 L9 9 L1 9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  )
}
