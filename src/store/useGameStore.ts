import { create } from 'zustand';
import { GameState, Card } from '../types/game';
import { GAME_CONFIG, THEMES, ThemeId } from '../config/gameConfig';

interface GameStore extends GameState {
  initGame: (mode?: '1v1' | 'solo', options?: { isTiebreaker?: boolean; pairs?: number; columns?: number }) => void;
  flipCard: (cardId: string) => void;
  resetTurn: () => void;
  decrementTimer: () => void;
  checkVictory: () => void;
  // Debug Actions
  togglePause: () => void;
  peekCards: () => void;
  setTimerConfig: (seconds: number) => void;
  setFlipDelayConfig: (ms: number) => void;
  setTheme: (theme: ThemeId) => void;
  toggleJerseyColors: () => void;
  setJokerEnabled: (enabled: boolean) => void;
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
  theme: 'nba_teams',
  isPaused: false,
  isPeeking: false,
  showJerseyColors: true,
  timerConfig: GAME_CONFIG.timer,
  flipDelayConfig: GAME_CONFIG.flipDelay,
  jokerEnabled: GAME_CONFIG.jokerEnabled,
  isTiebreaker: false,

  initGame: (mode, options = {}) => {
    const { isTiebreaker = false, pairs, columns } = options;
    const currentMode = mode || get().mode;
    const currentTheme = get().theme;
    const jokerEnabled = get().jokerEnabled && !isTiebreaker;
    
    const config = isTiebreaker 
      ? GAME_CONFIG.tiebreaker 
      : { 
          pairs: pairs || GAME_CONFIG.main.pairs, 
          columns: columns || GAME_CONFIG.main.columns 
        };

    const themeItems = THEMES[currentTheme].items;
    const numPairs = jokerEnabled ? config.pairs - 1 : config.pairs;
    const selectedItems = shuffle(themeItems).slice(0, numPairs);
    
    let cards: Card[] = [
      ...selectedItems.map((item, i) => ({ id: `card-${i}-a`, face: item, isFlipped: false, isMatched: false })),
      ...selectedItems.map((item, i) => ({ id: `card-${i}-b`, face: item, isFlipped: false, isMatched: false })),
    ];

    if (jokerEnabled) {
      cards.push(
        { id: 'joker-1', face: '💥', isFlipped: false, isMatched: false, isJoker: true },
        { id: 'joker-2', face: '💥', isFlipped: false, isMatched: false, isJoker: true }
      );
    }

    cards = shuffle(cards);

    set({
      mode: currentMode,
      status: 'playing',
      cards,
      columns: config.columns,
      matchedPairs: 0,
      isProcessing: false,
      timer: get().timerConfig,
      currentPlayerIndex: 0,
      winner: null,
      isPaused: false,
      isPeeking: false,
      isTiebreaker,
      players: isTiebreaker 
        ? get().players.map(p => ({ ...p, score: 0 }))
        : [
            { id: 1, name: 'Player 1', score: 0 },
            { id: 2, name: 'Player 2', score: 0 },
          ],
    });
  },

  flipCard: (cardId) => {
    const state = get();
    if (state.isProcessing || state.status !== 'playing' || state.isPaused || state.isPeeking) return;

    const flippedCards = state.cards.filter(c => c.isFlipped && !c.isMatched);
    if (flippedCards.length >= 2) return;

    const newCards = state.cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );

    const flippedCard = newCards.find(c => c.id === cardId);

    set({ cards: newCards });

    if (flippedCard?.isJoker) {
      set({ isProcessing: true });
      setTimeout(() => {
        const resetCards = get().cards.map(c => 
          (c.isFlipped && !c.isMatched) ? { ...c, isFlipped: false } : c
        );
        set({ 
          cards: resetCards,
          currentPlayerIndex: (get().currentPlayerIndex + 1) % 2,
          isProcessing: false,
          timer: get().timerConfig
        });
      }, state.flipDelayConfig);
      return;
    }

    const updatedFlippedCards = newCards.filter(c => c.isFlipped && !c.isMatched);
    
    if (updatedFlippedCards.length === 2) {
      set({ isProcessing: true });
      setTimeout(() => get().resetTurn(), state.flipDelayConfig);
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
        timer: state.timerConfig,
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
        timer: state.timerConfig,
      });
    }
  },

  decrementTimer: () => {
    const state = get();
    if (state.status !== 'playing' || state.isProcessing || state.isPaused || state.isPeeking) return;

    if (state.timer <= 0) {
      const newCards = state.cards.map(c => 
        (!c.isMatched) ? { ...c, isFlipped: false } : c
      );
      set({
        cards: newCards,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % 2,
        timer: state.timerConfig,
      });
    } else {
      set({ timer: state.timer - 1 });
    }
  },

  checkVictory: () => {
    const state = get();
    // Use the current number of cards to determine if we are in tiebreaker or main
    const _isTiebreaker = state.cards.length === (GAME_CONFIG.tiebreaker.pairs * 2);
    const jokerCount = state.cards.filter(c => c.isJoker).length;
    const totalPairs = (state.cards.length - jokerCount) / 2;
    const remainingPairs = totalPairs - state.matchedPairs;
    
    const p1 = state.players[0];
    const p2 = state.players[1];

    if (p1.score > (p2.score + remainingPairs)) {
      set({ 
        status: 'victoryLocked', 
        winner: p1,
        cards: state.cards.map(c => c.isJoker ? { ...c, isFlipped: true } : c)
      });
      return;
    }
    if (p2.score > (p1.score + remainingPairs)) {
      set({ 
        status: 'victoryLocked', 
        winner: p2,
        cards: state.cards.map(c => c.isJoker ? { ...c, isFlipped: true } : c)
      });
      return;
    }

    if (remainingPairs === 0) {
      if (p1.score === p2.score) {
        set({ status: 'tiebreaker' });
      } else {
        set({ 
          status: 'gameOver', 
          winner: p1.score > p2.score ? p1 : p2,
          cards: state.cards.map(c => c.isJoker ? { ...c, isFlipped: true } : c)
        });
      }
    }
  },

  togglePause: () => set(state => ({ isPaused: !state.isPaused })),

  peekCards: () => {
    const state = get();
    if (state.isPeeking || state.isProcessing) return;

    const originalCards = [...state.cards];
    const peekCards = state.cards.map(c => ({ ...c, isFlipped: true }));

    set({ isPeeking: true, cards: peekCards });

    setTimeout(() => {
      // Only restore if we are still peeking (i.e. game wasn't reset)
      if (get().isPeeking) {
        set({ isPeeking: false, cards: originalCards });
      }
    }, GAME_CONFIG.peekDuration);
  },

  setTimerConfig: (seconds) => set({ timerConfig: seconds, timer: seconds }),

  setFlipDelayConfig: (ms) => set({ flipDelayConfig: ms }),

  setTheme: (theme) => {
    const state = get();
    set({ theme });
    if (state.status !== 'idle') {
      const currentPairs = state.cards.length / 2;
      get().initGame(state.mode, { 
        isTiebreaker: state.isTiebreaker,
        pairs: currentPairs > 0 ? currentPairs : undefined, 
        columns: state.columns 
      });
    }
  },

  toggleJerseyColors: () => set(state => ({ showJerseyColors: !state.showJerseyColors })),

  setJokerEnabled: (enabled: boolean) => {
    set({ jokerEnabled: enabled });
    const state = get();
    if (state.status !== 'idle') {
      get().initGame(undefined, { isTiebreaker: state.isTiebreaker });
    }
  },
}));
