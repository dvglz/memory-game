# Memory Match

A two-player memory card game with NBA and NFL team logos.

## Quick Start

```bash
npm install
npm run dev
```

## Analytics (GA4)

GA4 is already wired up via `src/utils/analytics.ts` and initialized in `src/main.tsx`.
SPA route changes send `page_view` events automatically from `src/App.tsx`.

- Copy `env.example` → `.env`
- Set:

```bash
VITE_GA4_ID=G-8MMPECWNWC
```

## Debug Menu

Press **\`** (backtick) to toggle the debug panel.

### Options

| Option | Description |
|--------|-------------|
| **Game Theme** | Switch between NBA Teams / NFL Teams |
| **Grid Presets** | 12, 16, or 20 pairs with auto-layout |
| **Pause/Resume** | Freeze the game mid-play |
| **Peek** | Reveal all cards for 5 seconds |
| **Jersey Colors** | Show team color accents on cards |
| **Joker Mode** | Adds 2 trap cards—flip one = skip turn |
| **Turn Timer** | 5–60 seconds per turn |
| **Flip Duration** | 200–3000ms card flip delay |
| **Restart Game** | Reset with current settings |

## Stack

React, TypeScript, Zustand, Framer Motion, Tailwind CSS, Vite





