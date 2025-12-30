import { NBA_TEAMS, NFL_TEAMS } from '../data/teams';

export type ThemeId = 'nba_teams' | 'nfl_teams';

export interface ThemeConfig {
  name: string;
  path: string;
  items: string[];
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  nba_teams: {
    name: 'NBA Teams',
    path: '/assets/teams_nba/',
    items: Object.keys(NBA_TEAMS).map((key) => `NBA_${key}`),
  },
  nfl_teams: {
    name: 'NFL Teams',
    path: '/assets/teams_nfl/',
    items: Object.keys(NFL_TEAMS).map((key) => `NFL_${key}`),
  },
};

export const PAIR_PRESETS = [
  { pairs: 12, columns: 6, rows: 4 },
  { pairs: 16, columns: 8, rows: 4 },
  { pairs: 20, columns: 8, rows: 5 },
] as const;

export const GAME_CONFIG = {
  main: { pairs: 12, columns: 6 },
  tiebreaker: { pairs: 6, columns: 4 },
  timer: 15, // seconds
  flipDelay: 1000, // ms
  victoryDelay: 2000, // ms
  peekDuration: 5000, // ms
  jokerEnabled: false,
  assets: {
    back: '/assets/branding/clutch_minified.svg',
  }
};
