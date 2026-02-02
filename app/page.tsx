'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'

type Message = { role: 'user' | 'assistant'; content: string }

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!res.ok) throw new Error('Failed to get response')

      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message.content },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, something went wrong. Please try again.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/20 text-accent">
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-[hsl(var(--text))]">Chat Bot</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6">
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-4">
          {messages.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center animate-fade-in">
              <div className="rounded-2xl bg-surface-elevated border border-border p-8 max-w-sm">
                <p className="text-[hsl(var(--text-muted))] text-sm">
                  Say hello or ask anything. This bot responds with simple
                  replies.
                </p>
              </div>
              <p className="text-sm text-[hsl(var(--text-muted))]">
                Type below to get started
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-1.5 rounded-2xl rounded-bl-md bg-surface-elevated border border-border px-4 py-3">
                <span className="h-2 w-2 animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-[hsl(var(--text-muted))]" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-[hsl(var(--text-muted))]" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 animate-[bounce_1s_ease-in-out_infinite] rounded-full bg-[hsl(var(--text-muted))]" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="pt-2">
          <ChatInput onSend={sendMessage} disabled={loading} />
        </div>
      </main>
    </div>
  )
}
