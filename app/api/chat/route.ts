import { NextRequest, NextResponse } from 'next/server'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured. Add OPENAI_API_KEY to .env.local' },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : []

    const openaiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: 'You are a helpful, friendly chat assistant. Keep responses concise and clear.' },
      ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ]

    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        max_tokens: 1024,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      const message = (err as { error?: { message?: string } })?.error?.message || res.statusText
      return NextResponse.json(
        { error: `OpenAI API error: ${message}` },
        { status: res.status }
      )
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = data.choices?.[0]?.message?.content?.trim() ?? 'I couldn’t generate a response. Please try again.'

    return NextResponse.json({
      message: { role: 'assistant' as const, content },
    })
  } catch (e) {
    console.error('Chat API error:', e)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
