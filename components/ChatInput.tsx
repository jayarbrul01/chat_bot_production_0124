'use client'

import { useRef, useEffect } from 'react'

type ChatInputProps = {
  disabled?: boolean
  placeholder?: string
  onSend: (text: string) => void
}

export function ChatInput({
  disabled = false,
  placeholder = 'Type a message...',
  onSend,
}: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    const el = inputRef.current
    if (!el || disabled) return
    const text = el.value.trim()
    if (!text) return
    onSend(text)
    el.value = ''
    el.style.height = 'auto'
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleResize = () => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.addEventListener('input', handleResize)
    return () => el.removeEventListener('input', handleResize)
  }, [])

  return (
    <div className="flex items-end gap-3 rounded-2xl bg-surface-elevated border border-border p-2 focus-within:border-accent/50 transition-colors">
      <textarea
        ref={inputRef}
        rows={1}
        disabled={disabled}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="min-h-[44px] max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-[hsl(var(--text))] placeholder:text-[hsl(var(--text-muted))] focus:outline-none disabled:opacity-50"
        aria-label="Message"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-white hover:bg-accent-muted disabled:opacity-50 disabled:pointer-events-none transition-colors"
        aria-label="Send message"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </button>
    </div>
  )
}
