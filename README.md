# Chat Bot

A modern chat bot built with **Next.js** (App Router) and **Node.js** (API routes).

## Stack

- **Next.js 14** – React framework with App Router
- **TypeScript**
- **Tailwind CSS** – styling
- **API Route** – `/api/chat` for bot responses (Node.js backend)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` – start development server
- `npm run build` – build for production
- `npm run start` – run production server
- `npm run lint` – run ESLint

## Customization

- **Bot logic**: Edit `app/api/chat/route.ts` to change replies or integrate an LLM (e.g. OpenAI).
- **Styling**: Colors and theme are in `app/globals.css` (CSS variables) and `tailwind.config.ts`.
