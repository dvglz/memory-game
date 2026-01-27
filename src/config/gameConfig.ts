import { NBA_TEAMS, NFL_TEAMS } from '../data/teams';
import { NBA_PLAYERS, NFL_PLAYERS } from '../data/players';

export type ThemeId = 'nba-teams' | 'nfl-teams' | 'bron-mode' | 'nba-players' | 'nfl-players';

export interface ThemeConfig {
  name: string;
  path: string;
  items: string[];
  hidden?: boolean;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'nba-teams': {
    name: 'NBA Teams',
    path: '/assets/teams_nba/',
    items: Object.keys(NBA_TEAMS).map((key) => `NBA_${key}`),
  },
  'nfl-teams': {
    name: 'NFL Teams',
    path: '/assets/teams_nfl/',
    items: Object.keys(NFL_TEAMS).map((key) => `NFL_${key}`),
  },
  'nba-players': {
    name: 'NBA Players',
    path: '',
    items: Object.keys(NBA_PLAYERS).map((key) => `NBAP_${key}`),
  },
  'nfl-players': {
    name: 'NFL Players',
    path: '',
    items: Object.keys(NFL_PLAYERS).map((key) => `NFLP_${key}`),
  },
  'bron-mode': {
    name: '👑 Bron Mode',
    path: '/assets/bron/',
    items: Array.from({ length: 12 }, (_, i) => `bron_${String(i + 1).padStart(2, '0')}`),
    hidden: true,
  },
};

export const PAIR_PRESETS = [
  { pairs: 12, columns: 6, rows: 4 },
  { pairs: 16, columns: 8, rows: 4 },
  { pairs: 20, columns: 8, rows: 5 },
] as const;

export const GAME_CONFIG = {
  main: { pairs: 10, columns: 5, mobileColumns: 4 },
  tiebreaker: { pairs: 6, columns: 4, mobileColumns: 4 },
  timer: 15, // seconds
  flipDelay: 1000, // ms
  victoryDelay: 2000, // ms
  peekDuration: 5000, // ms
  jokerEnabled: false,
  solo: {
    goldThreshold: 20,
    silverThreshold: 30,
    peekDuration: 2000,
  },
  assets: {
    back: '/assets/misc/miss-match-logo_min.svg',
  }
};
