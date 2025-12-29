# 🏀 Project Brief: NBA Memory Match (MVP)

## 1. Project Summary
**NBA Memory Match** is a high-tempo, turn-based memory game designed for creator-led content (1v1, 2v2, or solo). It uses NBA players, memes, and moments as card faces. The goal is a January MVP launch optimized for recording promotional videos.

---

## 2. Technical Stack
* **Framework:** React + Vite + TypeScript
* **Styling:** Tailwind CSS (for rapid, responsive UI)
* **Animations:** Framer Motion (for smooth card flips and "Victory Locked" alerts)
* **State Management:** Zustand (centralized game engine, scores, and turn logic)

---

## 3. Core Game Logic
* **Turn-Based Flow:** * A player flips 2 cards.
    * **Match:** Cards stay face-up. Player scores 1 point and continues their turn.
    * **Miss:** Cards flip back after a delay. Turn passes to the opponent.
* **Race Condition Protection:** Global `isProcessing` flag to disable clicks during animations/checks.
* **"Victory Locked" (Ace Situation):** After every successful match, calculate if the leader is mathematically unbeatable:
    * `if (Leader.score > (RemainingPairs + TrailingPlayer.score))`
    * **Action:** Immediately pause gameplay, show "Victory Secured" UI, and end the match.
* **Tiebreaker Logic:** If the board clears with a tied score, automatically reload a smaller **12-card (6-pair)** grid to decide the winner.

---

## 4. Configuration System
The game is driven by a `gameConfig.ts` file to allow rapid updates without code changes:

```typescript
export interface GameConfig {
  boards: {
    main: { pairs: 16; columns: 8 };
    tiebreaker: { pairs: 6; columns: 4 };
  };
  settings: {
    flipBackDelay: 1000; // ms
    victoryDelay: 2000;  // ms
    defaultTimer: 15;    // 0 to disable
  };
  imagePacks: {
    id: string;
    name: string;
    urls: string[]; // 16+ image URLs
  }[];
}