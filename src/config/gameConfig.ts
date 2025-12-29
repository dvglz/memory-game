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
    items: [
      'NBA_ATL', 'NBA_BKN', 'NBA_BOS', 'NBA_CHA', 'NBA_CHI', 'NBA_CLE', 'NBA_DAL', 'NBA_DEN',
      'NBA_DET', 'NBA_GSW', 'NBA_HOU', 'NBA_IND', 'NBA_LAC', 'NBA_LAL', 'NBA_MEM', 'NBA_MIA',
      'NBA_MIL', 'NBA_MIN', 'NBA_NOP', 'NBA_NYK', 'NBA_OKC', 'NBA_ORL', 'NBA_PHI', 'NBA_PHX',
      'NBA_POR', 'NBA_SAC', 'NBA_SAS', 'NBA_TOR', 'NBA_UTA', 'NBA_WAS'
    ],
  },
  nfl_teams: {
    name: 'NFL Teams',
    path: '/assets/teams_nfl/',
    items: [
      'NFL_ARI', 'NFL_ATL', 'NFL_BAL', 'NFL_BUF', 'NFL_CAR', 'NFL_CHI', 'NFL_CIN', 'NFL_CLE',
      'NFL_DAL', 'NFL_DEN', 'NFL_DET', 'NFL_GB', 'NFL_HOU', 'NFL_IND', 'NFL_JAX', 'NFL_KC',
      'NFL_LAC', 'NFL_LAR', 'NFL_LV', 'NFL_MIA', 'NFL_MIN', 'NFL_NE', 'NFL_NO', 'NFL_NYG',
      'NFL_NYJ', 'NFL_PHI', 'NFL_PIT', 'NFL_SEA', 'NFL_SF', 'NFL_TB', 'NFL_TEN', 'NFL_WAS'
    ],
  },
};

export const PAIR_PRESETS = [
  { pairs: 12, columns: 6, rows: 4 },
  { pairs: 16, columns: 8, rows: 4 },
  { pairs: 20, columns: 8, rows: 5 },
] as const;

export const GAME_CONFIG = {
  main: { pairs: 12, columns: 6 },
  tiebreaker: { pairs: 6, columns: 3 },
  timer: 15, // seconds
  flipDelay: 1000, // ms
  victoryDelay: 2000, // ms
  peekDuration: 5000, // ms
  assets: {
    back: '/assets/branding/clutch_minified.svg',
  }
};

export const NBA_TEAMS = THEMES.nba_teams.items;
