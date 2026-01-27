import { create } from 'zustand';
import { GameState, Card, SoloTier, SoloBest } from '../types/game';
import { GAME_CONFIG, THEMES, ThemeId } from '../config/gameConfig';
import { NBA_PLAYERS, NFL_PLAYERS } from '../data/players';
import { preloadImages } from '../utils/imagePreloader';
import { trackEvent } from '../utils/analytics';

// Preload core assets immediately
preloadImages([
  GAME_CONFIG.assets.back,
  '/assets/misc/bg-pattern.svg'
]);

let analyticsRound = 0;
let lastTrackedStartRound = -1;
let lastTrackedEndRound = -1;
let currentAnalyticsSource: 'home' | 'rematch' | 'overtime' | 'restart' = 'home';

interface GameStore extends GameState {
  initGame: (mode?: '1v1' | 'solo', options?: { isTiebreaker?: boolean; pairs?: number; columns?: number; playerCount?: number }) => void;
  flipCard: (cardId: string) => void;
  resetTurn: () => void;
  decrementTimer: () => void;
  checkVictory: () => void;
  incrementSoloTime: () => void;
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
  debugEndGame: () => void;
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
  soloResult: null,
  soloElapsedTime: 0,
  soloHasPeeked: false,

  initGame: (mode, options = {}) => {
    const { isTiebreaker = false, pairs, columns, playerCount } = options;
    const prevStatus = get().status;
    const currentMode = mode || get().mode;
    const currentTheme = get().theme;
    const jokerEnabled = currentMode === 'solo' ? false : (get().jokerEnabled && !isTiebreaker);
    const currentPlayerCount = currentMode === 'solo' ? 1 : (playerCount || get().playerCount);

    analyticsRound += 1;
    if (isTiebreaker) {
      currentAnalyticsSource = 'overtime';
    } else if (prevStatus === 'idle') {
      currentAnalyticsSource = 'home';
    } else if (prevStatus === 'victoryLocked' || prevStatus === 'gameOver') {
      currentAnalyticsSource = 'rematch';
    } else {
      currentAnalyticsSource = 'restart';
    }

    if (lastTrackedStartRound !== analyticsRound) {
      lastTrackedStartRound = analyticsRound;
      trackEvent('game_start', {
        game_mode: currentMode,
        theme: currentTheme,
        source: currentAnalyticsSource,
      });
    }
    
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
      soloResult: null,
      soloElapsedTime: 0,
      soloHasPeeked: false,
      players: isTiebreaker 
        ? get().players.map(p => ({ 
            ...p, 
            score: 0,
            stats: { ...p.stats, currentStreak: 0 } // Reset streak for tiebreaker
          }))
        : Array.from({ length: currentPlayerCount }, (_, i) => ({
            id: i + 1,
            name: currentMode === 'solo' ? 'You' : `Player ${i + 1}`,
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

    // Auto-peek for solo mode
    if (currentMode === 'solo') {
      const peekCards = get().cards.map(c => ({ ...c, isFlipped: true }));
      const newRevealed = new Set<string>();
      get().cards.forEach(c => newRevealed.add(c.id));
      
      set({ isPeeking: true, cards: peekCards, revealedCardIds: newRevealed, soloHasPeeked: true });
      
      setTimeout(() => {
        if (get().isPeeking && get().mode === 'solo') {
          const resetCards = get().cards.map(c => ({ ...c, isFlipped: false }));
          set({ isPeeking: false, cards: resetCards });
        }
      }, GAME_CONFIG.solo.peekDuration);
    }
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
    if (state.mode === 'solo' || state.status !== 'playing' || state.isProcessing || state.isPaused || state.isPeeking) return;

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

  incrementSoloTime: () => {
    const state = get();
    if (state.mode !== 'solo' || state.status !== 'playing' || state.isPaused || state.isPeeking) return;
    
    // Update both soloElapsedTime and player's timeSpent stat
    const newPlayers = [...state.players];
    if (newPlayers[0]) {
      newPlayers[0].stats.timeSpent += 1;
    }
    
    set({ 
      soloElapsedTime: state.soloElapsedTime + 1,
      players: newPlayers
    });
  },

  checkVictory: () => {
    const state = get();
    const jokerCount = state.cards.filter(c => c.isJoker).length;
    const totalPairs = (state.cards.length - jokerCount) / 2;
    const remainingPairs = totalPairs - state.matchedPairs;
    
    if (state.mode === 'solo') {
      if (remainingPairs === 0) {
        const moves = state.players[0].stats.totalMoves;
        let tier: SoloTier = null;
        if (moves <= GAME_CONFIG.solo.goldThreshold) tier = 'gold';
        else if (moves <= GAME_CONFIG.solo.silverThreshold) tier = 'silver';

        // LocalStorage logic
        const storageKey = `solo_best_${state.theme}`;
        const saved = localStorage.getItem(storageKey);
        const best: SoloBest | null = saved ? JSON.parse(saved) : null;
        
        const isNewBest = !best || moves < best.moves;
        if (isNewBest) {
          localStorage.setItem(storageKey, JSON.stringify({
            moves,
            tier,
            timestamp: Date.now()
          }));
        }

        set({ 
          status: 'gameOver', 
          winner: state.players[0],
          soloResult: {
            tier,
            isNewBest,
            bestMoves: best?.moves
          }
        });
      }
      return;
    }

    // Sort players by score descending
    const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);
    const leader = sortedPlayers[0];
    const runnerUp = sortedPlayers[1];

    // Check if leader cannot be caught
    if (leader.score > runnerUp.score + remainingPairs) {
      if (lastTrackedEndRound !== analyticsRound) {
        lastTrackedEndRound = analyticsRound;
        trackEvent('game_end', {
          game_mode: state.mode,
          theme: state.theme,
          source: currentAnalyticsSource,
          end_state: 'victoryLocked',
        });
      }
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
        if (lastTrackedEndRound !== analyticsRound) {
          lastTrackedEndRound = analyticsRound;
          trackEvent('game_end', {
            game_mode: state.mode,
            theme: state.theme,
            source: currentAnalyticsSource,
            end_state: 'gameOver',
          });
        }
        set({ 
          status: 'gameOver', 
          winner: leader,
          cards: state.cards.map(c => c.isJoker ? { ...c, isFlipped: true } : c)
        });
      } else {
        if (lastTrackedEndRound !== analyticsRound) {
          lastTrackedEndRound = analyticsRound;
          trackEvent('game_end', {
            game_mode: state.mode,
            theme: state.theme,
            source: currentAnalyticsSource,
            end_state: 'tiebreaker',
          });
        }
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
    players: []
  }),

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

  debugEndGame: () => {
    const state = get();
    if (state.status === 'idle') return;

    const jokerCount = state.cards.filter(c => c.isJoker).length;
    const totalPairs = (state.cards.length - jokerCount) / 2;
    
    const newPlayers = [...state.players];
    
    if (state.mode === 'solo') {
      const player = newPlayers[0];
      // Randomize moves for solo
      const moves = Math.floor(Math.random() * 30) + 10; // 10-40 moves
      player.stats.totalMoves = moves;
      player.stats.timeSpent = Math.floor(Math.random() * 60) + 30; // 30-90 seconds
      
      let tier: SoloTier = null;
      if (moves <= GAME_CONFIG.solo.goldThreshold) tier = 'gold';
      else if (moves <= GAME_CONFIG.solo.silverThreshold) tier = 'silver';

      const storageKey = `solo_best_${state.theme}`;
      const saved = localStorage.getItem(storageKey);
      const best: SoloBest | null = saved ? JSON.parse(saved) : null;
      const isNewBest = !best || moves < best.moves;

      set({ 
        status: 'gameOver', 
        winner: player,
        players: newPlayers,
        matchedPairs: totalPairs,
        cards: state.cards.map(c => ({ ...c, isMatched: true, isFlipped: true })),
        soloResult: {
          tier,
          isNewBest,
          bestMoves: best?.moves
        }
      });
    } else {
      // 1v1 or multiplayer
      // Distribute pairs randomly
      let remainingPairs = totalPairs;
      newPlayers.forEach((p, i) => {
        const take = i === newPlayers.length - 1 ? remainingPairs : Math.floor(Math.random() * (remainingPairs + 1));
        p.score = take;
        p.stats.totalMoves = take + Math.floor(Math.random() * 10);
        p.stats.timeSpent = Math.floor(Math.random() * 100);
        remainingPairs -= take;
      });

      // Sort to find winner
      const sorted = [...newPlayers].sort((a, b) => b.score - a.score);
      const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score;

      if (isTie) {
        set({ 
          status: 'tiebreaker',
          players: newPlayers,
          matchedPairs: totalPairs,
          cards: state.cards.map(c => ({ ...c, isMatched: true, isFlipped: true }))
        });
      } else {
        set({ 
          status: 'gameOver', 
          winner: sorted[0],
          players: newPlayers,
          matchedPairs: totalPairs,
          cards: state.cards.map(c => ({ ...c, isMatched: true, isFlipped: true }))
        });
      }
    }
  },
}));
