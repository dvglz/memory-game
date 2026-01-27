import { ThemeId } from "../config/gameConfig";

export type GameStatus = 'idle' | 'playing' | 'checking' | 'victoryLocked' | 'tiebreaker' | 'gameOver';

export type SoloTier = 'gold' | 'silver' | null;

export interface SoloBest {
  moves: number;
  tier: SoloTier;
  timestamp: number;
}

export interface Card {
  id: string;
  face: string;
  isFlipped: boolean;
  isMatched: boolean;
  isJoker?: boolean;
  isBlind?: boolean;
}

export interface Player {
  id: number;
  name: string;
  score: number;
  stats: {
    blindShots: number;
    maxStreak: number;
    currentStreak: number;
    totalMoves: number;
    timeSpent: number;
    trapHits: number;
  };
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
  playerCount: number;
  columns: number;
  revealedCardIds: Set<string>;
  soloResult: {
    tier: SoloTier;
    isNewBest: boolean;
    bestMoves?: number;
  } | null;
  soloElapsedTime: number;
  soloHasPeeked: boolean;
  // Debug & Config
  theme: ThemeId;
  isPaused: boolean;
  isPeeking: boolean;
  showJerseyColors: boolean;
  timerConfig: number;
  flipDelayConfig: number;
  jokerEnabled: boolean;
  isTiebreaker: boolean;
  debugShowResults: boolean;
}
