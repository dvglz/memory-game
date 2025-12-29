import { create } from 'zustand';
import { GameState, Card, Player, GameStatus } from '../types/game';
import { GAME_CONFIG, NBA_TEAMS } from '../config/gameConfig';

interface GameStore extends GameState {
  initGame: (mode: '1v1' | 'solo', isTiebreaker?: boolean) => void;
  flipCard: (cardId: string) => void;
  resetTurn: () => void;
  decrementTimer: () => void;
  checkVictory: () => void;
}

const shuffle = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useGameStore = create<GameStore>((set, get) => ({
  status: 'idle',
  cards: [],
  players: [
    { id: 1, name: 'Player 1', score: 0 },
    { id: 2, name: 'Player 2', score: 0 },
  ],
  currentPlayerIndex: 0,
  isProcessing: false,
  timer: GAME_CONFIG.timer,
  matchedPairs: 0,
  winner: null,
  mode: '1v1',
  columns: GAME_CONFIG.main.columns,

  initGame: (mode, isTiebreaker = false) => {
    const config = isTiebreaker ? GAME_CONFIG.tiebreaker : GAME_CONFIG.main;
    const selectedTeams = shuffle(NBA_TEAMS).slice(0, config.pairs);
    const cards: Card[] = shuffle([
      ...selectedTeams.map((team, i) => ({ id: `card-${i}-a`, face: team, isFlipped: false, isMatched: false })),
      ...selectedTeams.map((team, i) => ({ id: `card-${i}-b`, face: team, isFlipped: false, isMatched: false })),
    ]);

    set({
      mode,
      status: 'playing',
      cards,
      columns: config.columns,
      matchedPairs: 0,
      isProcessing: false,
      timer: GAME_CONFIG.timer,
      currentPlayerIndex: 0,
      winner: null,
      players: isTiebreaker 
        ? get().players.map(p => ({ ...p, score: 0 })) // Reset for tiebreaker
        : [
            { id: 1, name: 'Player 1', score: 0 },
            { id: 2, name: 'Player 2', score: 0 },
          ],
    });
  },

  flipCard: (cardId) => {
    const state = get();
    if (state.isProcessing || state.status !== 'playing') return;

    const flippedCards = state.cards.filter(c => c.isFlipped && !c.isMatched);
    if (flippedCards.length >= 2) return;

    const newCards = state.cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );

    set({ cards: newCards });

    const updatedFlippedCards = newCards.filter(c => c.isFlipped && !c.isMatched);
    
    if (updatedFlippedCards.length === 2) {
      set({ isProcessing: true });
      setTimeout(() => get().resetTurn(), GAME_CONFIG.flipDelay);
    }
  },

  resetTurn: () => {
    const state = get();
    const flippedCards = state.cards.filter(c => c.isFlipped && !c.isMatched);
    
    if (flippedCards.length !== 2) return;

    const [card1, card2] = flippedCards;
    const isMatch = card1.face === card2.face;

    if (isMatch) {
      const newCards = state.cards.map(c => 
        c.face === card1.face ? { ...c, isMatched: true } : c
      );
      
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].score += 1;
      
      const newMatchedPairs = state.matchedPairs + 1;
      
      set({
        cards: newCards,
        players: newPlayers,
        matchedPairs: newMatchedPairs,
        isProcessing: false,
        timer: GAME_CONFIG.timer, // Reset timer on match
      });

      get().checkVictory();
    } else {
      const newCards = state.cards.map(c => 
        (c.id === card1.id || c.id === card2.id) ? { ...c, isFlipped: false } : c
      );

      set({
        cards: newCards,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % 2,
        isProcessing: false,
        timer: GAME_CONFIG.timer,
      });
    }
  },

  decrementTimer: () => {
    const state = get();
    if (state.status !== 'playing' || state.isProcessing) return;

    if (state.timer <= 0) {
      // Time's up - flip back open cards and pass turn
      const newCards = state.cards.map(c => 
        (!c.isMatched) ? { ...c, isFlipped: false } : c
      );
      set({
        cards: newCards,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % 2,
        timer: GAME_CONFIG.timer,
      });
    } else {
      set({ timer: state.timer - 1 });
    }
  },

  checkVictory: () => {
    const state = get();
    const config = state.cards.length === 12 ? GAME_CONFIG.tiebreaker : GAME_CONFIG.main;
    const remainingPairs = config.pairs - state.matchedPairs;
    
    const p1 = state.players[0];
    const p2 = state.players[1];

    // Victory Locked condition
    if (p1.score > (p2.score + remainingPairs)) {
      set({ status: 'victoryLocked', winner: p1 });
      return;
    }
    if (p2.score > (p1.score + remainingPairs)) {
      set({ status: 'victoryLocked', winner: p2 });
      return;
    }

    // Board cleared
    if (remainingPairs === 0) {
      if (p1.score === p2.score) {
        set({ status: 'tiebreaker' });
      } else {
        set({ 
          status: 'gameOver', 
          winner: p1.score > p2.score ? p1 : p2 
        });
      }
    }
  },
}));

