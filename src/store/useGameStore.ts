import { create } from 'zustand';
import { GameState, Card, Player } from '../types/game';
import { GAME_CONFIG, THEMES, ThemeId } from '../config/gameConfig';
import { NBA_PLAYERS, NFL_PLAYERS } from '../data/players';
import { preloadImages } from '../utils/imagePreloader';
import type { RoomState, ClientCard } from '../multiplayer/types';

// Preload core assets immediately
preloadImages([
  GAME_CONFIG.assets.back,
  '/assets/misc/bg-pattern.svg'
]);

interface GameStore extends GameState {
  initGame: (mode?: '1v1' | 'solo', options?: { isTiebreaker?: boolean; pairs?: number; columns?: number; playerCount?: number }) => void;
  flipCard: (cardId: string) => void;
  resetTurn: () => void;
  decrementTimer: () => void;
  checkVictory: () => void;
  // Online multiplayer
  syncFromServer: (serverState: RoomState) => void;
  setOnlineMode: (isOnline: boolean) => void;
  // Debug Actions
  togglePause: () => void;
  peekCards: () => void;
  toggleDebugResults: () => void;
  setTimerConfig: (seconds: number) => void;
  setFlipDelayConfig: (ms: number) => void;
  setTheme: (theme: ThemeId) => void;
  toggleJerseyColors: () => void;
  setJokerEnabled: (enabled: boolean) => void;
  resetToIdle: () => void;
  debugTriggerEffect: (type: 'blind' | 'streak') => void;
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
    { 
      id: 1, 
      name: 'Player 1', 
      score: 0,
      stats: { blindShots: 0, maxStreak: 0, currentStreak: 0, totalMoves: 0, timeSpent: 0, trapHits: 0 }
    },
    { 
      id: 2, 
      name: 'Player 2', 
      score: 0,
      stats: { blindShots: 0, maxStreak: 0, currentStreak: 0, totalMoves: 0, timeSpent: 0, trapHits: 0 }
    },
  ],
  currentPlayerIndex: 0,
  isProcessing: false,
  timer: GAME_CONFIG.timer,
  matchedPairs: 0,
  winner: null,
  mode: '1v1',
  playerCount: 2,
  columns: GAME_CONFIG.main.columns,
  theme: 'nba-teams',
  isPaused: false,
  isPeeking: false,
  showJerseyColors: true,
  timerConfig: GAME_CONFIG.timer,
  flipDelayConfig: GAME_CONFIG.flipDelay,
  jokerEnabled: GAME_CONFIG.jokerEnabled,
  isTiebreaker: false,
  revealedCardIds: new Set(),
  debugShowResults: false,
  isOnline: false,
  myPlayerIndex: -1,

  initGame: (mode, options = {}) => {
    const { isTiebreaker = false, pairs, columns, playerCount } = options;
    const currentMode = mode || get().mode;
    const currentTheme = get().theme;
    const jokerEnabled = get().jokerEnabled && !isTiebreaker;
    const currentPlayerCount = playerCount || get().playerCount;
    
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

    // Preload round images
    const themePath = THEMES[currentTheme].path;
    const imageUrls = cards
      .filter(c => !c.isJoker)
      .map(c => {
        if (currentTheme === 'nba-players') {
          const playerKey = c.face.split('_')[1];
          return NBA_PLAYERS[playerKey]?.headshot;
        }
        if (currentTheme === 'nfl-players') {
          const playerKey = c.face.split('_')[1];
          return NFL_PLAYERS[playerKey]?.headshot;
        }
        return `${themePath}${c.face}.${currentTheme === 'bron-mode' ? 'jpg' : 'webp'}`;
      })
      .filter((url): url is string => !!url);

    preloadImages(imageUrls);

    set({
      mode: currentMode,
      status: 'playing',
      cards,
      columns: config.columns,
      playerCount: currentPlayerCount,
      matchedPairs: 0,
      isProcessing: false,
      timer: get().timerConfig,
      currentPlayerIndex: 0,
      winner: null,
      isPaused: false,
      isPeeking: false,
      isTiebreaker,
      revealedCardIds: new Set(),
      isOnline: false,
      myPlayerIndex: -1,
      players: isTiebreaker 
        ? get().players.map(p => ({ 
            ...p, 
            score: 0,
            stats: { ...p.stats, currentStreak: 0 } // Reset streak for tiebreaker
          }))
        : Array.from({ length: currentPlayerCount }, (_, i) => ({
            id: i + 1,
            name: `Player ${i + 1}`,
            score: 0,
            stats: {
              blindShots: 0,
              maxStreak: 0,
              currentStreak: 0,
              totalMoves: 0,
              timeSpent: 0,
              trapHits: 0,
            }
          })),
    });
  },

  flipCard: (cardId) => {
    const state = get();
    if (state.isProcessing || state.status !== 'playing' || state.isPaused || state.isPeeking) return;

    const flippedCards = state.cards.filter(c => c.isFlipped && !c.isMatched);
    if (flippedCards.length >= 2) return;

    const card = state.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped) return;

    const isBlind = !state.revealedCardIds.has(cardId);
    const newRevealed = new Set(state.revealedCardIds);
    newRevealed.add(cardId);

    const newCards = state.cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true, isBlind } : c
    );

    set({ 
      cards: newCards,
      revealedCardIds: newRevealed
    });

    if (card.isJoker) {
      const newPlayers = [...state.players];
      const currentPlayer = newPlayers[state.currentPlayerIndex];
      currentPlayer.stats.trapHits += 1;
      currentPlayer.stats.currentStreak = 0;
      currentPlayer.stats.totalMoves += 1;

      set({ 
        isProcessing: true,
        players: newPlayers
      });

      console.log(`%c[TRAP] Player ${currentPlayer.id}`, 'color: #f59e0b; font-weight: bold', {
        blindShot: isBlind,
        streak: 0,
        moves: currentPlayer.stats.totalMoves
      });

      setTimeout(() => {
        const resetCards = get().cards.map(c => 
          (c.isFlipped && !c.isMatched) ? { ...c, isFlipped: false } : c
        );
        set({ 
          cards: resetCards,
          currentPlayerIndex: (get().currentPlayerIndex + 1) % get().playerCount,
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

    const newPlayers = [...state.players];
    const currentPlayer = newPlayers[state.currentPlayerIndex];

    if (isMatch) {
      const newCards = state.cards.map(c => 
        c.face === card1.face ? { ...c, isMatched: true } : c
      );
      
      currentPlayer.score += 1;
      currentPlayer.stats.currentStreak += 1;
      currentPlayer.stats.maxStreak = Math.max(currentPlayer.stats.maxStreak, currentPlayer.stats.currentStreak);
      currentPlayer.stats.totalMoves += 1;
      
      if (card1.isBlind && card2.isBlind) {
        currentPlayer.stats.blindShots += 1;
      }

      const newMatchedPairs = state.matchedPairs + 1;
      
      set({
        cards: newCards,
        players: newPlayers,
        matchedPairs: newMatchedPairs,
        isProcessing: false,
        timer: state.timerConfig,
      });

      console.log(`%c[MATCH] Player ${currentPlayer.id}`, 'color: #10b981; font-weight: bold', {
        blindShot: card1.isBlind && card2.isBlind,
        streak: currentPlayer.stats.currentStreak,
        moves: currentPlayer.stats.totalMoves
      });

      get().checkVictory();
    } else {
      const newCards = state.cards.map(c => 
        (c.id === card1.id || c.id === card2.id) ? { ...c, isFlipped: false } : c
      );

      currentPlayer.stats.totalMoves += 1;
      currentPlayer.stats.currentStreak = 0;

      set({
        cards: newCards,
        players: newPlayers,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.playerCount,
        isProcessing: false,
        timer: state.timerConfig,
      });

      console.log(`%c[MISS] Player ${currentPlayer.id}`, 'color: #ef4444; font-weight: bold', {
        blindShot: card1.isBlind && card2.isBlind,
        streak: 0,
        moves: currentPlayer.stats.totalMoves
      });
    }
  },

  decrementTimer: () => {
    const state = get();
    // Online games use server timer
    if (state.isOnline) return;
    if (state.status !== 'playing' || state.isProcessing || state.isPaused || state.isPeeking) return;

    if (state.timer <= 0) {
      const newCards = state.cards.map(c => 
        (!c.isMatched) ? { ...c, isFlipped: false } : c
      );
      
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].stats.currentStreak = 0;

      set({
        cards: newCards,
        players: newPlayers,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.playerCount,
        timer: state.timerConfig,
      });
    } else {
      const newPlayers = [...state.players];
      newPlayers[state.currentPlayerIndex].stats.timeSpent += 1;
      
      set({ 
        timer: state.timer - 1,
        players: newPlayers
      });
    }
  },

  checkVictory: () => {
    const state = get();
    const jokerCount = state.cards.filter(c => c.isJoker).length;
    const totalPairs = (state.cards.length - jokerCount) / 2;
    const remainingPairs = totalPairs - state.matchedPairs;
    
    // Sort players by score descending
    const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
    const leader = sortedPlayers[0];
    const runnerUp = sortedPlayers[1];

    // Check if leader cannot be caught
    if (leader.score > runnerUp.score + remainingPairs) {
      set({ 
        status: 'victoryLocked', 
        winner: leader,
        cards: state.cards.map(c => c.isJoker ? { ...c, isFlipped: true } : c)
      });
      return;
    }

    // End of game
    if (remainingPairs === 0) {
      if (leader.score > runnerUp.score) {
        set({ 
          status: 'gameOver', 
          winner: leader,
          cards: state.cards.map(c => c.isJoker ? { ...c, isFlipped: true } : c)
        });
      } else {
        // Tie between at least the top two players
        set({ status: 'tiebreaker' });
      }
    }
  },

  togglePause: () => set(state => ({ isPaused: !state.isPaused })),

  peekCards: () => {
    const state = get();
    if (state.isPeeking || state.isProcessing) return;

    const originalCards = [...state.cards];
    const peekCards = state.cards.map(c => ({ ...c, isFlipped: true }));
    const newRevealed = new Set(state.revealedCardIds);
    state.cards.forEach(c => newRevealed.add(c.id));

    set({ isPeeking: true, cards: peekCards, revealedCardIds: newRevealed });

    setTimeout(() => {
      // Only restore if we are still peeking (i.e. game wasn't reset)
      if (get().isPeeking) {
        set({ isPeeking: false, cards: originalCards });
      }
    }, GAME_CONFIG.peekDuration);
  },

  toggleDebugResults: () => set(state => ({ debugShowResults: !state.debugShowResults })),

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

  resetToIdle: () => set({ 
    status: 'idle', 
    cards: [], 
    matchedPairs: 0, 
    winner: null,
    currentPlayerIndex: 0,
    players: [],
    isOnline: false,
    myPlayerIndex: -1,
  }),

  setOnlineMode: (isOnline: boolean) => set({ isOnline }),

  syncFromServer: (serverState: RoomState) => {
    // Convert server cards to local Card format
    const cards: Card[] = serverState.cards.map((c: ClientCard) => ({
      id: c.id,
      face: c.face || '', // Will be empty string until revealed
      isFlipped: c.isFlipped,
      isMatched: c.isMatched,
    }));

    // Convert server players to local Player format
    const players: Player[] = serverState.players.map((p, i) => ({
      id: i + 1,
      name: p.name,
      score: p.score,
      stats: {
        blindShots: 0,
        maxStreak: 0,
        currentStreak: 0,
        totalMoves: 0,
        timeSpent: 0,
        trapHits: 0,
      },
    }));

    // Map server status to local status
    let status: GameState['status'] = 'idle';
    if (serverState.status === 'playing') status = 'playing';
    else if (serverState.status === 'finished') {
      status = serverState.winner ? 'gameOver' : 'tiebreaker';
    }
    else if (serverState.status === 'waiting') status = 'idle';

    // Count matched pairs
    const matchedPairs = cards.filter(c => c.isMatched).length / 2;

    // Determine winner
    let winner: Player | null = null;
    if (serverState.winner && players.length > 0) {
      const winnerIndex = serverState.players.findIndex(
        p => p.id === serverState.winner?.id
      );
      if (winnerIndex >= 0) {
        winner = players[winnerIndex];
      }
    }

    set({
      status,
      cards,
      players,
      currentPlayerIndex: serverState.currentPlayerIndex,
      timer: serverState.timer,
      matchedPairs,
      winner,
      isOnline: true,
      myPlayerIndex: serverState.myPlayerIndex,
      playerCount: 2,
      columns: 5, // Fixed for V1: 10 pairs = 5 columns
      mode: '1v1',
    });

    // Preload images for revealed cards
    const revealedFaces = cards
      .filter(c => c.face && c.face.startsWith('NBA_'))
      .map(c => `/assets/teams_nba/${c.face}.webp`);
    if (revealedFaces.length > 0) {
      preloadImages(revealedFaces);
    }
  },

  debugTriggerEffect: (type) => {
    const state = get();
    const newPlayers = [...state.players];
    if (newPlayers.length === 0) return;
    
    const currentPlayer = newPlayers[state.currentPlayerIndex];
    if (type === 'blind') {
      currentPlayer.stats.blindShots += 1;
    } else {
      // Ensure it's > 1 to trigger the effect in GameEffects
      if (currentPlayer.stats.currentStreak < 2) {
        currentPlayer.stats.currentStreak = 2;
      } else {
        currentPlayer.stats.currentStreak += 1;
      }
    }
    
    set({ players: newPlayers });
  },
}));
