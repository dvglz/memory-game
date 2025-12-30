import { ThemeId } from "../config/gameConfig";

export type GameStatus = 'idle' | 'playing' | 'checking' | 'victoryLocked' | 'tiebreaker' | 'gameOver';

export interface Card {
  id: string;
  face: string;
  isFlipped: boolean;
  isMatched: boolean;
  isJoker?: boolean;
}

export interface Player {
  id: number;
  name: string;
  score: number;
}

export interface GameState {
  status: GameStatus;
  cards: Card[];
  players: Player[];
  currentPlayerIndex: number;
  isProcessing: boolean;
  timer: number;
  matchedPairs: number;
  winner: Player | 'tie' | null;
  mode: '1v1' | 'solo';
  columns: number;
  // Debug & Config
  theme: ThemeId;
  isPaused: boolean;
  isPeeking: boolean;
  showJerseyColors: boolean;
  timerConfig: number;
  flipDelayConfig: number;
  jokerEnabled: boolean;
  isTiebreaker: boolean;
}
